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

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

#define DOCK_ID_JOGO1 "pelotense-controle-jogo1"
#define DOCK_TITULO_JOGO1 "Jogo 1"
#define DOCK_ID_JOGO2 "pelotense-controle-jogo2"
#define DOCK_TITULO_JOGO2 "Jogo 2"
#define URL_PADRAO_JOGO1 "https://pelotense-esportes.netlify.app/placar-broadcast-escalacao/controle"
#define URL_PADRAO_JOGO2 "https://pelotense-esportes.netlify.app/placar-broadcast-escalacao-2/controle"
#define MAX_TENTATIVAS 120

static QCef *cef_panel = nullptr;

struct Painel {
	QPointer<QDockWidget> dock;
	QPointer<QCefWidget> navegador;
	QPointer<PainelPonte> ponte;
	char url[2048];
	bool esteve_oculto = false;
};

static Painel painel_jogo1;
static Painel painel_jogo2;

OBS_DECLARE_MODULE()
OBS_MODULE_USE_DEFAULT_LOCALE(MODULE_NAME, "pt-BR")
OBS_MODULE_AUTHOR("Pelotense Esportes")

static void ler_urls(void)
{
	char *caminho = obs_module_config_path("url.txt");
	if (caminho) {
		FILE *arquivo = fopen(caminho, "r");
		if (arquivo) {
			char linha[2048];
			int n = 0;
			while (n < 2 && fgets(linha, sizeof(linha), arquivo)) {
				size_t tamanho = strlen(linha);
				while (tamanho &&
				       (linha[tamanho - 1] == '\n' || linha[tamanho - 1] == '\r'))
					linha[--tamanho] = 0;
				if (!linha[0])
					continue;
				if (n == 0)
					snprintf(painel_jogo1.url, sizeof(painel_jogo1.url), "%s", linha);
				else
					snprintf(painel_jogo2.url, sizeof(painel_jogo2.url), "%s", linha);
				n++;
			}
			fclose(arquivo);
		}
		bfree(caminho);
	}

	char *env = getenv("PELOTENSE_CONTROLE_URL_JOGO1");
	if (env && *env)
		snprintf(painel_jogo1.url, sizeof(painel_jogo1.url), "%s", env);

	env = getenv("PELOTENSE_CONTROLE_URL_JOGO2");
	if (env && *env)
		snprintf(painel_jogo2.url, sizeof(painel_jogo2.url), "%s", env);
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

static void configurar_painel(Painel *p, const char *id, const char *titulo, QCef *cef, int deslocamento)
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

		QScreen *tela = janela ? QGuiApplication::screenAt(janela->geometry().center()) : nullptr;
		if (tela) {
			QRect area = tela->availableGeometry();
			QSize tamanho = dock->size();
			QRect geo(area.center().x() - tamanho.width() / 2,
				  area.center().y() - tamanho.height() / 2, tamanho.width(),
				  tamanho.height());
			geo = geo.intersected(area);
			geo.translate(deslocamento, deslocamento);
			dock->setGeometry(geo);
		} else if (deslocamento) {
			QPoint posicao = dock->pos();
			dock->move(posicao.x() + deslocamento, posicao.y() + deslocamento);
		}

		QObject::connect(
			dock, &QDockWidget::visibilityChanged, dock, [p, dock, cef](bool visivel) {
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

static QColor misturar(const QColor &a, const QColor &b, qreal t)
{
	return QColor(qRound(a.red() + (b.red() - a.red()) * t),
		      qRound(a.green() + (b.green() - a.green()) * t),
		      qRound(a.blue() + (b.blue() - a.blue()) * t));
}

static QString qss_botao(const QColor &cor, const QColor &checked)
{
	return QString("QPushButton{background:%1;color:#060606;border:none;"
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

static QIcon icone_pelota(void)
{
	QPixmap pm(16, 16);
	pm.fill(Qt::transparent);

	QPainter p(&pm);
	p.setRenderHint(QPainter::Antialiasing);
	p.setPen(QPen(QColor("#0a1a02"), 1.4));
	p.setBrush(QColor("#a5ef1c"));
	p.drawEllipse(QRectF(2.0, 2.0, 12.0, 12.0));

	QPolygon pentagono;
	for (int i = 0; i < 5; i++) {
		double a = -90.0 + i * 72.0;
		pentagono << QPoint(qRound(8.0 + 3.0 * cos(a * M_PI / 180.0)),
				    qRound(8.0 + 3.0 * sin(a * M_PI / 180.0)));
	}
	p.setBrush(QColor("#060606"));
	p.drawPolygon(pentagono);
	p.end();

	return QIcon(pm);
}

static void estilizar_pulso_botao(QPushButton *botao, qreal t)
{
	QColor alvo = misturar(QColor("#a5ef1c"), QColor("#e8ffb4"), t);
	botao->setStyleSheet(qss_botao(QColor("#a5ef1c"), alvo));
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

	botao->setIcon(icone_pelota());
	botao->setIconSize(QSize(14, 14));
	botao->setStyleSheet(qss_botao(QColor("#a5ef1c"), QColor("#7fb50f")));
}

static QPushButton *criar_botao_toggle(QWidget *contexto, QDockWidget *alvo,
				       const char *texto, const char *dica)
{
	QPushButton *botao = new QPushButton(texto);
	botao->setCheckable(true);
	botao->setAutoDefault(false);
	botao->setChecked(alvo->isVisible());
	botao->setToolTip(dica);
	estilizar_botao(botao);

	QObject::connect(botao, &QPushButton::toggled, contexto, [alvo](bool checado) {
		alvo->setVisible(checado);
	});
	QObject::connect(botao, &QPushButton::toggled, contexto, [botao](bool checado) {
		if (checado)
			pulso_iniciar(botao);
		else
			pulso_parar(botao);
	});
	QObject::connect(alvo, &QDockWidget::visibilityChanged, contexto,
			 [botao](bool visivel) { botao->setChecked(visivel); });

	return botao;
}

static void adicionar_botoes_controles(void)
{
	if (!painel_jogo1.dock || !painel_jogo2.dock)
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

	QHBoxLayout *linha = new QHBoxLayout();
	linha->setSpacing(4);
	linha->setContentsMargins(0, 0, 0, 0);
	linha->addWidget(criar_botao_toggle(frame, painel_jogo1.dock.data(), "JOGO 1",
					    "Abrir/fechar painel Jogo 1 (placar + escalação)"));
	linha->addWidget(criar_botao_toggle(frame, painel_jogo2.dock.data(), "JOGO 2",
					    "Abrir/fechar painel Jogo 2 (placar + escalação 2)"));

	QWidget *bloco = new QWidget(frame);
	QVBoxLayout *coluna = new QVBoxLayout(bloco);
	coluna->setSpacing(4);
	coluna->setContentsMargins(0, 0, 0, 0);

	QLabel *rotulo = new QLabel(bloco);
	rotulo->setTextFormat(Qt::RichText);
	rotulo->setText("<span style='color:#a5ef1c;font-weight:bold;'>PELOTENSE</span> "
			"<span style='color:#dcdcdc;font-weight:bold;'>ESPORTES</span>");
	rotulo->setStyleSheet("border-left:3px solid #a5ef1c;padding-left:6px;"
			      "background:transparent;");
	coluna->addWidget(rotulo);
	coluna->addLayout(linha);

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

	configurar_painel(&painel_jogo1, DOCK_ID_JOGO1, DOCK_TITULO_JOGO1, cef_panel, 0);
	configurar_painel(&painel_jogo2, DOCK_ID_JOGO2, DOCK_TITULO_JOGO2, cef_panel, 40);

	adicionar_botoes_controles();
}

static void ao_evento(enum obs_frontend_event evento, void *)
{
	if (evento == OBS_FRONTEND_EVENT_FINISHED_LOADING) {
		snprintf(painel_jogo1.url, sizeof(painel_jogo1.url), "%s", URL_PADRAO_JOGO1);
		snprintf(painel_jogo2.url, sizeof(painel_jogo2.url), "%s", URL_PADRAO_JOGO2);
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
	obs_frontend_remove_dock(DOCK_ID_JOGO1);
	obs_frontend_remove_dock(DOCK_ID_JOGO2);
}

const char *obs_module_description(void)
{
	return "Painéis de controle Jogo 1 e Jogo 2 do Pelotense Esportes dentro do OBS.";
}