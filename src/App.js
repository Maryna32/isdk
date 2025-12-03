import { useState } from "react";

export default function TalkBackClient() {
  const talkbackId = process.env.REACT_APP_TALKBACKID;
  const apiKey = process.env.REACT_APP_APIKEY;
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const sendCommand = async (command) => {
    setLoading(true);
    setStatus({ message: `Відправка команди: ${command}...`, type: "info" });

    try {
      const url = `https://api.thingspeak.com/talkbacks/${talkbackId}/commands`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `api_key=${apiKey}&command_string=${command}`,
      });

      if (response.ok) {
        const data = await response.text();
        setStatus({
          message: `Команда "${command}" успішно відправлена! ID: ${data}`,
          type: "success",
        });
      } else {
        setStatus({
          message: `Помилка: ${response.status} - ${response.statusText}`,
          type: "error",
        });
      }
    } catch (error) {
      setStatus({
        message: `Помилка з'єднання: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const commands = [
    { name: "LED1_ON", label: "LED 1 увімкнути", color: "red" },
    { name: "LED1_OFF", label: "LED 1 вимкнути", color: "red-dark" },
    { name: "LED2_ON", label: "LED 2 увімкнути", color: "green" },
    { name: "LED2_OFF", label: "LED 2 вимкнути", color: "green-dark" },
    { name: "LED3_ON", label: "LED 3 увімкнути", color: "cyan" },
    { name: "LED3_OFF", label: "LED 3 вимкнути", color: "cyan-dark" },
    { name: "ALL_ON", label: "Всі увімкнути", color: "yellow" },
    { name: "ALL_OFF", label: "Всі вимкнути", color: "gray" },
    {
      name: "SEND_TEMP",
      label: "Відправити температуру та вологість",
      color: "blue",
    },
  ];

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          {status.message && (
            <div
              className={`status-message ${
                status.type === "success"
                  ? "status-success"
                  : status.type === "error"
                  ? "status-error"
                  : "status-info"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="commands-panel">
            <h2 className="commands-title">Команди керування</h2>
            <div className="buttons-grid">
              {commands.map((cmd) => (
                <button
                  key={cmd.name}
                  onClick={() => sendCommand(cmd.name)}
                  disabled={loading}
                  className={`command-button btn-${cmd.color}`}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
