function planOpenPort(port, protocol = 'tcp') {
  return {
    port,
    protocol,
    ufw: `ufw allow ${port}/${protocol}`,
    firewalld: `firewall-cmd --permanent --add-port=${port}/${protocol} && firewall-cmd --reload`
  };
}

module.exports = { planOpenPort };
