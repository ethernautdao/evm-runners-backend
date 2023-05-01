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
              background-color: #0f1012;
              font-family: Effra Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              letter-spacing: 1px;
            }
            .panel {
              width: 80%;
              max-width: 500px;
              padding: 20px;
              text-align: center;
              background: linear-gradient(317.38deg, #18191c, #000);
              border: 1px solid rgb(108, 108, 108);
              border-radius: 24px;
              box-shadow: rgb(0 0 0 / 24%) 12px 16px 24px, rgb(0 0 0 / 24%) 12px 8px 12px, rgb(0 0 0 / 32%) 4px 4px;
            }
            h1, p {
              font-family: Effra Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              letter-spacing: 1px;
              color: #a9bcce;
            }
            a {
              color: inherit;
              text-decoration: none;
            }
            footer {
              color: #585f69;
              text-align: center;
              padding: 20px;
              position: fixed;
              bottom: 0;
              width: 100%;
            }
            button {
              font-family: Effra Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              letter-spacing: 1px;
              margin-top: 1rem;
              padding: 10px 20px;
              border-radius: 5px;
              background: linear-gradient(97.42deg, #cdffe6, #8fdeff 94.24%);
              color: black;
              border: none;
              cursor: pointer;
              border-radius: 32px;
              transition: all 0.3s ease-in-out;
            }
            button:hover {
              background: linear-gradient(194.84deg, #cdffe6, #8fdeff 94.24%);
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
          <footer>
            <a href="https://mint.ethernautdao.io/" target="_blank" rel="noopener noreferrer">
              <p>EthernautDAO 2023✧</p>
            </a>
          <footer>
        </body>
      </html>
    `;
}
