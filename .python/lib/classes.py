#!/usr/bin/env python

import datetime
import smtplib
from logging.handlers import SMTPHandler


class SSLSMTPHandler(SMTPHandler):
    def emit(self, record):
        try:
            smtp = smtplib.SMTP_SSL(
                self.mailhost,
                self.mailport or smtplib.SMTP_SSL_PORT,
            )

            if self.username and self.password:
                smtp.login(self.username, self.password)

            now = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
            message = f"Subject: {now}\n"
            message += f"From: <{self.fromaddr}>\n"
            message += f"To: <{self.toaddrs[0]}>\n\n"
            message += f"{self.format(record)}"

            smtp.sendmail(
                self.fromaddr,
                self.toaddrs,
                message.encode(encoding="utf-8"),
            )
            smtp.quit()

        except (KeyboardInterrupt, SystemExit):
            raise

        except Exception:
            raise
