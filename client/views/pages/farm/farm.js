Template.farm.helpers({
    dtcPrice: function () {
        let price = 0
        if (Session.get('metamaskBnbLiquidities') && Session.get('metamaskUniswapLiquidities')) {
            price = Session.get('metamaskUniswapLiquidities').weth
            price /= Session.get('metamaskUniswapLiquidities').dtc
            price *= Session.get('metamaskBnbLiquidities').busd
            price /= Session.get('metamaskBnbLiquidities').bnb
        }
        return price.toFixed(3)
    },
    dtcLiq: function () {
        return Session.get('metamaskUniswapLiquidities')
    },
    lpBalance: function() {
        return Session.get('metamaskLpBalance')
    },
    lpFarming: function() {
        return Session.get('metamaskLpFarming')
    },
    pendingReward: function() {
        return Session.get('metamaskFarmReward')
    },
    totalValueLocked: function() {
        let price = 0
        if (Session.get('metamaskBnbLiquidities') && Session.get('metamaskUniswapLiquidities')) {
            price = Session.get('metamaskUniswapLiquidities').weth
            price /= Session.get('metamaskUniswapLiquidities').dtc
            price *= Session.get('metamaskBnbLiquidities').busd
            price /= Session.get('metamaskBnbLiquidities').bnb
            return formatter.format((Session.get('metamaskUniswapLiquidities').dtc * 2 * price))
        } else {
          return price
        }
    },
    apy: () => {
      const liquidities = Session.get('metamaskUniswapLiquidities').dtc * 2
      const oneYearReward = metamask.farmRewardPerBlock() * 28800 * 365
      const apr = oneYearReward / liquidities
      const aprd = apr / 365
      const apy = Math.pow(1+aprd, 365) - 1
      return (100*apy).toFixed(1)
    },
    aprd: () => {
      const liquidities = Session.get('metamaskUniswapLiquidities').dtc * 2
      const oneYearReward = metamask.farmRewardPerBlock() * 28800 * 365
      const apr = oneYearReward / liquidities
      const aprd = apr / 365
      return (aprd*100).toFixed(4)
    },
    allowance: function() {
        return Session.get('metamaskFarmAllowance')
    }
  })

Template.farm.events({
    "click #connectMetamask": function() {
      metamask.connect()
    },
    "click #addliquidity": function() {
      window.open("https://pancakeswap.finance/add/BNB/0xd3Cceb42B544e91eee02EB585cc9a7b47247BfDE")
    },
      "click #buydtc": function() {
        window.open("https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xd3cceb42b544e91eee02eb585cc9a7b47247bfde")
    },
    "click #depositlp": function() {
        let amount = prompt("Enter deposit amount", Session.get('metamaskLpBalance'));
        if (!amount) return
        amount *= Math.pow(10,18)
        amount = Math.floor(amount)
        metamask.depositLP(amount)
    },
    "click #withdrawlp": function() {
        let amount = prompt("Enter deposit amount", Session.get('metamaskLpFarming'));
        if (!amount) return
        amount *= Math.pow(10,18)
        amount = Math.floor(amount)
        metamask.withdrawLP(amount)
    },
    "click #harvest": function() {
        metamask.depositLP(0)
    },
    "click #enablefarm": function() {
        metamask.farmEnable()
    }
  })

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  