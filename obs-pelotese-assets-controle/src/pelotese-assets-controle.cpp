#include <obs-module.h>
#include <obs-frontend-api.h>
#include <util/platform.h>

#include <QDockWidget>
#include <QFont>
#include <QGuiApplication>
#include <QHBoxLayout>
#include <QMainWindow>
#include <QPainter>
#include <QPen>
#include <QPointer>
#include <QPixmap>
#include <QPolygon>
#include <QPushButton>
#include <QScreen>
#include <QTimer>
#include <QVariantAnimation>
#include <QVBoxLayout>
#include <QLabel>
#include <QIcon>
#include <QSize>
#include <QColor>
#include <QEasingCurve>

#include "browser-panel.hpp"
#include "painel-ponte.hpp"

#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>

#define DOCK_ID_ASSETS "obs-pelotese-assets-controle-dock"
#define DOCK_TITULO_ASSETS "Assets"
#define URL_PADRAO_ASSETS "https://pelotense-assets.netlify.app/testes"
#define ACENTO_COR "#6366f1"
#define MAX_TENTATIVAS 120

static QCef *cef_panel = nullptr;

struct Painel {
	QPointer<QDockWidget> dock;
	QPointer<QCefWidget> navegador;
	QPointer<PainelPonte> ponte;
	char url[2048];
	bool esteve_oculto = false;
};

static Painel painel_assets;

OBS_DECLARE_MODULE()
OBS_MODULE_USE_DEFAULT_LOCALE(MODULE_NAME, "pt-BR")
OBS_MODULE_AUTHOR("Pelotese")

static void ler_urls(void)
{
	snprintf(painel_assets.url, sizeof(painel_assets.url), "%s", URL_PADRAO_ASSETS);

	char *caminho = obs_module_config_path("url.txt");
	if (caminho) {
		FILE *arquivo = fopen(caminho, "r");
		if (arquivo) {
			char linha[2048];
			if (fgets(linha, sizeof(linha), arquivo)) {
				size_t tamanho = strlen(linha);
				while (tamanho &&
				       (linha[tamanho - 1] == '\n' || linha[tamanho - 1] == '\r'))
					linha[--tamanho] = 0;
				if (linha[0])
					snprintf(painel_assets.url, sizeof(painel_assets.url), "%s",
						 linha);
			}
			fclose(arquivo);
		}
		bfree(caminho);
	}

	char *env = getenv("PELOTESE_ASSETS_CONTROLE_URL");
	if (env && *env)
		snprintf(painel_assets.url, sizeof(painel_assets.url), "%s", env);
}

static void conectar_titulo(Painel *p)
{
	if (!p->ponte || !p->navegador)
		return;
	QObject::connect(p->navegador.data(), SIGNAL(titleChanged(const QString &)),
			 p->ponte.data(), SLOT(definirTitulo(const QString &)));
}

static void recriar_widget(Painel *p)
{
	QDockWidget *dock = p->dock.data();
	if (!dock)
		return;

	QCefWidget *novo = cef_panel->create_widget(dock, p->url);
	if (novo) {
		dock->setWidget(novo);
		p->navegador = novo;
		conectar_titulo(p);
	}
}

static void centralizar_painel(Painel *p)
{
	QDockWidget *dock = p->dock.data();
	if (!dock)
		return;

	QMainWindow *janela = (QMainWindow *)obs_frontend_get_main_window();
	QScreen *tela = janela ? QGuiApplication::screenAt(janela->geometry().center()) : nullptr;
	if (tela) {
		QRect area = tela->availableGeometry();
		QSize tamanho = dock->size();
		if (tamanho.width() < 400 || tamanho.height() < 300) {
			tamanho = QSize(1700, 900);
			dock->resize(tamanho);
		}
		QRect geo(area.center().x() - tamanho.width() / 2,
			  area.center().y() - tamanho.height() / 2, tamanho.width(),
			  tamanho.height());
		geo = geo.intersected(area);
		dock->setGeometry(geo);
	}
}

static QColor misturar(const QColor &a, const QColor &b, qreal t)
{
	return QColor(qRound(a.red() + (b.red() - a.red()) * t),
		      qRound(a.green() + (b.green() - a.green()) * t),
		      qRound(a.blue() + (b.blue() - a.blue()) * t));
}

static QString qss_botao(const QColor &cor, const QColor &checked)
{
	return QString("QPushButton{background:%1;color:#0a0a0f;border:none;"
		       "border-radius:3px;padding:6px;}"
		       "QPushButton:hover{background:%2;}"
		       "QPushButton:pressed{background:%3;}"
		       "QPushButton:checked{background:%4;}"
		       "QPushButton:checked:hover{background:%5;}")
		.arg(cor.name())
		.arg(misturar(cor, QColor("#ffffff"), 0.14).name())
		.arg(misturar(cor, QColor("#000000"), 0.16).name())
		.arg(checked.name())
		.arg(misturar(checked, QColor("#ffffff"), 0.18).name());
}

static QIcon icone_assets(void)
{
	QPixmap pm(16, 16);
	pm.fill(Qt::transparent);

	QPainter p(&pm);
	p.setRenderHint(QPainter::Antialiasing);
	p.setPen(QPen(QColor("#151533"), 1.4));
	p.setBrush(QColor(ACENTO_COR));
	p.drawRoundedRect(QRectF(2.0, 2.0, 12.0, 12.0), 2.5, 2.5);

	p.setBrush(QColor("#0a0a1a"));
	p.drawRect(QRectF(6.0, 6.0, 4.0, 4.0));
	p.end();

	return QIcon(pm);
}

static void estilizar_pulso_botao(QPushButton *botao, qreal t)
{
	QColor alvo = misturar(QColor(ACENTO_COR), QColor("#c7c9ff"), t);
	botao->setStyleSheet(qss_botao(QColor(ACENTO_COR), alvo));
}

static void pulso_parar(QPushButton *botao)
{
	QVariantAnimation *anim = botao->findChild<QVariantAnimation *>();
	if (anim) {
		anim->stop();
		delete anim;
	}
	estilizar_pulso_botao(botao, 0.0);
}

static void pulso_iniciar(QPushButton *botao)
{
	if (botao->findChild<QVariantAnimation *>())
		return;

	QVariantAnimation *anim = new QVariantAnimation(botao);
	anim->setDuration(1000);
	anim->setStartValue(0.0);
	anim->setEndValue(1.0);
	anim->setKeyValueAt(0.0, 0.0);
	anim->setKeyValueAt(0.5, 1.0);
	anim->setKeyValueAt(1.0, 0.0);
	anim->setLoopCount(-1);
	anim->setEasingCurve(QEasingCurve::InOutSine);
	QObject::connect(anim, &QVariantAnimation::valueChanged, botao, [botao](const QVariant &v) {
		estilizar_pulso_botao(botao, v.toReal());
	});
	anim->start();
}

static void estilizar_botao(QPushButton *botao)
{
	QFont fonte("Inter", 10);
	fonte.setBold(true);
	botao->setFont(fonte);

	botao->setIcon(icone_assets());
	botao->setIconSize(QSize(14, 14));
	botao->setStyleSheet(qss_botao(QColor(ACENTO_COR), QColor("#4f52d1")));
}

static void configurar_painel(Painel *p, const char *id, const char *titulo, QCef *cef)
{
	QWidget *pai = (QWidget *)obs_frontend_get_main_window();
	p->navegador = cef->create_widget(pai, p->url);
	if (!p->navegador) {
		blog(LOG_WARNING, "[%s] Falha ao criar widget para %s.", MODULE_NAME, titulo);
		return;
	}

	if (!obs_frontend_add_dock_by_id(id, titulo, p->navegador.data())) {
		delete p->navegador.data();
		p->navegador = nullptr;
		return;
	}

	QMainWindow *janela = (QMainWindow *)pai;
	p->dock = janela ? janela->findChild<QDockWidget *>(id) : nullptr;
	QDockWidget *dock = p->dock.data();
	if (dock) {
		dock->setMinimumSize(400, 300);
		dock->resize(1700, 900);
		dock->setFloating(true);

		p->ponte = new PainelPonte(titulo, dock);
		p->ponte->definirDock(dock);
		conectar_titulo(p);

		centralizar_painel(p);

		QObject::connect(dock, &QDockWidget::visibilityChanged, dock, [p](bool visivel) {
			if (visivel) {
				if (p->esteve_oculto)
					recriar_widget(p);
			} else {
				p->esteve_oculto = true;
			}
		});
	}

	blog(LOG_INFO, "[%s] Painel criado: %s (%s)", MODULE_NAME, titulo, p->url);
}

static void adicionar_botao_controles(void)
{
	if (!painel_assets.dock)
		return;

	QMainWindow *janela = (QMainWindow *)obs_frontend_get_main_window();
	if (!janela)
		return;

	QDockWidget *controles = janela->findChild<QDockWidget *>("controlsDock");
	if (!controles)
		return;

	QWidget *frame = controles->findChild<QWidget *>("controlsFrame");
	if (!frame)
		return;

	QVBoxLayout *layout = qobject_cast<QVBoxLayout *>(frame->layout());
	if (!layout)
		return;

	QPushButton *botao = new QPushButton("ASSETS");
	botao->setCheckable(true);
	botao->setAutoDefault(false);
	botao->setChecked(painel_assets.dock->isVisible());
	botao->setToolTip("Abrir/fechar painel Assets (pelotense-assets.netlify.app/testes)");
	estilizar_botao(botao);

	QObject::connect(botao, &QPushButton::toggled, frame, [](bool checado) {
		painel_assets.dock->setVisible(checado);
	});
	QObject::connect(botao, &QPushButton::toggled, frame, [botao](bool checado) {
		if (checado)
			pulso_iniciar(botao);
		else
			pulso_parar(botao);
	});
	QObject::connect(painel_assets.dock.data(), &QDockWidget::visibilityChanged, frame,
			 [botao](bool visivel) { botao->setChecked(visivel); });

	QWidget *bloco = new QWidget(frame);
	QVBoxLayout *coluna = new QVBoxLayout(bloco);
	coluna->setSpacing(4);
	coluna->setContentsMargins(0, 0, 0, 0);

	QLabel *rotulo = new QLabel(bloco);
	rotulo->setTextFormat(Qt::RichText);
	rotulo->setText(QString("<span style='color:%1;font-weight:bold;'>PELOTENSE</span> ")
			     .arg(ACENTO_COR)
			     .append("<span style='color:#dcdcdc;font-weight:bold;'>ASSETS</span>"));
	rotulo->setStyleSheet(QString("border-left:3px solid %1;padding-left:6px;"
				      "background:transparent;")
				      .arg(ACENTO_COR));
	coluna->addWidget(rotulo);
	coluna->addWidget(botao);

	layout->addWidget(bloco);
}

static void criar_paineis(int tentativa)
{
	if (!cef_panel)
		cef_panel = obs_browser_init_panel();

	if (!cef_panel) {
		blog(LOG_WARNING, "[%s] obs-browser nao encontrado.", MODULE_NAME);
		return;
	}

	if (!cef_panel->initialized()) {
		cef_panel->init_browser();

		if (tentativa >= MAX_TENTATIVAS) {
			blog(LOG_WARNING, "[%s] CEF nao inicializou a tempo.", MODULE_NAME);
			return;
		}
		QTimer::singleShot(500, [tentativa]() { criar_paineis(tentativa + 1); });
		return;
	}

	configurar_painel(&painel_assets, DOCK_ID_ASSETS, DOCK_TITULO_ASSETS, cef_panel);

	adicionar_botao_controles();
}

static void ao_evento(enum obs_frontend_event evento, void *)
{
	if (evento == OBS_FRONTEND_EVENT_FINISHED_LOADING) {
		ler_urls();
		criar_paineis(0);
	}
}

bool obs_module_load(void)
{
	obs_frontend_add_event_callback(ao_evento, nullptr);
	return true;
}

void obs_module_unload(void)
{
	obs_frontend_remove_event_callback(ao_evento, nullptr);
	obs_frontend_remove_dock(DOCK_ID_ASSETS);
}

const char *obs_module_description(void)
{
	return "Painel Assets do Pelotese dentro do OBS.";
}