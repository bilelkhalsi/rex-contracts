const PortfolioFactory = artifacts.require("PortfolioFactory");
const Portfolio = artifacts.require("Portfolio");
const ipfsHash = 'QmbYSzHanSkBDDfGnyTJoNUM18XDHdXJdx43BDZVeFBDQj';

contract('PortfolioFactory', function (accounts) {

    it('should create new portfolio and return resulting tx', async function () {
        const account = accounts[0];
        const factory = await PortfolioFactory.deployed();
        const result = await factory.createPortfolio(ipfsHash, {from: account});
        // const portfolio = await Portfolio.at()
        assert.isNotEmpty(result.tx, 'Transaction is not empty');
        assert.isNotEmpty(result.logs, 'Transaction logs is not empty');
    });

    it('should fire portfolio created event', async function () {
        const account = accounts[1];
        const factory = await PortfolioFactory.deployed();
        const result = await factory.createPortfolio(ipfsHash, {from: account});
        const events = result.logs;

        assert.lengthOf(events, 1, 'PortfolioCreated event fired');
        assert.nestedPropertyVal(events[0], 'event', 'PortfolioCreated');

    });

    it('should throw portfolio aleard exist', async function () {
        const account = accounts[2];
        const factory = await PortfolioFactory.deployed();
        const firstTry = await factory.createPortfolio(ipfsHash, {from: account});

        assert.lengthOf(firstTry.logs, 1, 'PortfolioCreated event fired');
        assert.nestedPropertyVal(firstTry.logs[0], 'event', 'PortfolioCreated');

        factory.createPortfolio(ipfsHash, {from: account})
        .then(
            function(result) {
                assert.fail("Error did not thrown");
            },
            function(error) {
                const address = Object.keys(error.data)[0]; 
                const tx = error.data[address]; 
                assert.nestedPropertyVal(tx, 'error', 'revert');
                assert.nestedPropertyVal(tx, 'reason', 'Portfolio already exist!');
            }
        );
    });

    it('should throw portfolio not found', async function () {
        const account = accounts[3]; 
        PortfolioFactory.deployed()
        .then(function(factory) {
            return factory.getPortfolioAddress({from: account});
        })
        .then(
            function(result) {
                assert.fail("Error did not thrown");
            },
            function(error) {
                const address = Object.keys(error.data)[0]; 
                const tx = error.data[address]; 
                assert.nestedPropertyVal(tx, 'error', 'revert');
                assert.nestedPropertyVal(tx, 'reason', 'Portfolio not fount!');
            }
        );
        
    });

    it('should update protfolio data', async function () {
        const account = accounts[3];
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });
        const data = await portfolio.getData();
        assert.equal(data, ipfsHash, "Waou i am getting my portfolio identifier");
    });

    it('should update protfolio data', async function () {
        const account = accounts[4];
        const newIpfsHash = 'QmbYSzHanSkBDDfGnyTJoNUM18XDHdXJdx43BDZVeFBDMD';
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });
        
        const event = await portfolio.updatePortfolio(newIpfsHash, {from: account})
        .then(function(tx) {
            return tx.logs[0];
        });
        const data = await portfolio.getData();
        const creationDate = await portfolio.getCreationDate();
        const lastUpdatedDate = await portfolio.getLastUpdatedDate();
        assert.notEqual(creationDate, lastUpdatedDate);
        assert.equal(data, newIpfsHash, "Waou i am getting my portfolio updated");
        assert.equal(event.event, 'PortfolioUpdated', "Update event fired");
    });

    it('should throw caller must be owner of portfolio', async function () {
        const account = accounts[5];
        const newIpfsHash = 'QmbYSzHanSkBDDfGnyTJoNUM18XDHdXJdx43BDZVeFBDMD';
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });     
        await portfolio.updatePortfolio(newIpfsHash)
        .then(function(tx) {
            assert.fail("Expected error did not thrown");
        }, function(error) {
            const address = Object.keys(error.data)[0]; 
            const tx = error.data[address]; 
            assert.nestedPropertyVal(tx, 'error', 'revert');
            assert.nestedPropertyVal(tx, 'reason', 'You must be owner of the portfolio');
        });
    });

    it('should return portfolio data', async function () {
        const account = accounts[6];
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });
        const data = await portfolio.getData({from: account});
        assert.equal(data, ipfsHash);
    });

    it('should return portfolio creation date', async function () {
        const account = accounts[7];
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });
        const creationDate = await portfolio.getCreationDate();
        assert.isNotNull(creationDate);
    });

    it('should return portfolio last updated date', async function () {
        const account = accounts[8];
        const factory = await PortfolioFactory.deployed();
        const portfolio = await factory.createPortfolio(ipfsHash, {from: account})
       .then(function(result) {
            return factory.getPortfolioAddress({from: account});
        }).then(function(address) {
            return Portfolio.at(address);
        });
        const lastUpdatedDate = await portfolio.getLastUpdatedDate();
        assert.isNotNull(lastUpdatedDate);
    });

});
