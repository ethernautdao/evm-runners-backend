export default function PinCodeHtml(pin: string) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>PIN Code</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: Arial, sans-serif;
              background-color: #1e1e1e;
              color: #f2f2f2;
            }
            .panel {
              width: 80%;
              max-width: 500px;
              padding: 20px;
              background-color: #2b2b2b;
              box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
              text-align: center;
              border-radius: 10px;
            }
            h1, p {
              margin: 0;
              color: #f2f2f2;
            }
            button {
              margin-top: 1rem;
              padding: 10px 20px;
              border-radius: 5px;
              background-color: #4CAF50;
              color: white;
              border: none;
              cursor: pointer;
              transition: all 0.3s ease-in-out;
            }
            button:hover {
              background-color: #398140;
            }
          </style>
        </head>
        <body>
          <div class="panel">
            <h1>PIN Code</h1>
            <p>${pin}</p>
            <button onclick="copyToClipboard('${pin}')">Copy to clipboard</button>
          </div>
          <script>
            function copyToClipboard(text) {
              navigator.clipboard.writeText(text);
            }
          </script>
        </body>
      </html>
    `;
}
