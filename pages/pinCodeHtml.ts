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
            height: auto;
            padding: 20px;
            background-color: #2b2b2b;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            text-align: center;
            border-radius: 10px;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #f2f2f2;
          }
          p {
            font-size: 2rem;
            margin-bottom: 2rem;
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
            font-size: 1.5rem;
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
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }
        </script>
      </body>
    </html>
  `;
}
