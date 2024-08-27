const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  return date.toLocaleDateString('en-US', options);
}

module.exports = formatDate;
