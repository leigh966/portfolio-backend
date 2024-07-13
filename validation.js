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

const lowerCase = "qwertyuiopasdfghjklzxcvbnmm";
const upperCase = lowerCase.toUpperCase();
const allowedCharacters = lowerCase + upperCase + "1234567890.";
export function removeDangerousCharacters(s) {
  let output = "";
  for (let i = 0; i < s.length; i++) {
    if (!allowedCharacters.includes(s[i])) {
      const replacement = `#${s.charCodeAt(i)}#`;
      output += replacement;
    } else {
      output += s[i];
    }
  }
  return output;
}
