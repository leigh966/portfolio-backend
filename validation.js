export function restoreDangerousCharacters(s) {
  const list = s.split("#");
  let output = "";
  for (let i = 0; i < list.length; i++) {
    if (i % 2 == 1) {
      output += String.fromCharCode(list[i]);
    } else {
      output += list[i];
    }
  }
  return output;
}
