import https from 'https';
https.get('https://pay.wiapy.com/2YN9oWQpwa', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/[^"'\s]+\.(png|jpg|jpeg|svg|webp)/g);
    console.log(matches ? matches.join('\n') : 'No images found');
  });
});
