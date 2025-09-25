<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ANYWAY MD QR LOGIN</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white flex items-center justify-center min-h-screen">
  <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
    <h1 class="text-2xl font-bold mb-4 text-green-400">ANYWAY MD QR LOGIN</h1>
    <p class="text-sm mb-6">Scan the QR Code below with your WhatsApp to login.</p>

    <div id="qrcode" class="bg-white p-4 rounded-lg inline-block"></div>

    <p class="mt-6 text-sm text-gray-400">Powered by <span class="text-green-400 font-semibold">Anyway Tech</span></p>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
  <script>
    // Example QR generation (replace with backend code injection)
    QRCode.toCanvas(document.getElementById('qrcode'), "YOUR_QR_STRING_HERE", function (error) {
      if (error) console.error(error);
    });
  </script>
</body>
</html>
