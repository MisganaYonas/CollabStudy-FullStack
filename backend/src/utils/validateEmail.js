function validateEmail(email) {
  const regex = /^[a-zA-Z]+\.(ugr|UGR)-\d{4}-\d{2}@aau\.edu\.et$/;
  return regex.test(email);
}

module.exports = validateEmail;

