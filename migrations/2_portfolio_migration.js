const PortfolioFactory = artifacts.require("PortfolioFactory");

module.exports = function (deployer) {
  deployer.deploy(PortfolioFactory);
};
