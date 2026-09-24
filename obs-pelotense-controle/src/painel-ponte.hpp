#pragma once

#include <QDockWidget>
#include <QObject>
#include <QPointer>
#include <QString>

class PainelPonte : public QObject {
	Q_OBJECT
	QPointer<QDockWidget> dock_;
	QString prefixo_;

public:
	explicit PainelPonte(const QString &prefixo, QObject *pai = nullptr)
		: QObject(pai), prefixo_(prefixo)
	{
	}

	void definirDock(QDockWidget *dock) { dock_ = dock; }

private slots:
	void definirTitulo(const QString &titulo)
	{
		if (!dock_)
			return;
		QString limpo = titulo.trimmed();
		if (limpo.isEmpty() || limpo.startsWith(QLatin1String("http")))
			return;
		QString completo =
			prefixo_.isEmpty() ? limpo : prefixo_ + QStringLiteral(" · ") + limpo;
		dock_->setWindowTitle(completo);
	}
};