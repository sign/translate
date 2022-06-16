describe('manifest.webmanifest', () => {
  const filePath = 'src/manifest.webmanifest';

  // Prevent mistakes like - https://github.com/sign/translate/commit/ad0ef31a0a2b3cd989dff6a9dcec742157d9619d
  it('webmanifest should be a valid JSON file', async () => {
    const res = await fetch('base/' + filePath);
    const txt = await res.text();
    expect(JSON.parse(txt)).toBeTruthy();
  });
});
