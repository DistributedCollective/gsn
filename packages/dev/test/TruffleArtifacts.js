const TruffleContract = require( '@truffle/contract' )
const fs = require('fs')

function readdir(folder) {
    try {
        const subs = fs.readdirSync(folder)
        return subs.map(item=>readdir(folder+'/'+item)).flat()
    } catch (e){
        return [folder]
    }
}

function findFile(folder,name) {
  const allFiles = readdir(folder)
    return allFiles.find(x=>x.endsWith("/"+name))
}

var accounts 

global.artifacts.require = function(name ) {
  const  fileName = findFile(this._artifactsPath, name+'.json')
  console.log( 'artifacts.require: loading', fileName)
  const {abi, bytecode} = JSON.parse(fs.readFileSync(fileName, 'ascii'))
  const contract = TruffleContract({abi, unlinked_binary: bytecode})
  contract.setProvider(web3.currentProvider)

  contract.defaults( {gasPrice:15000000, gas:1e9, from:accounts?accounts[0]:null})
  //no accounts yet (called from global context). so re-initialize defaults async'ly
  if ( !accounts ) {
    web3.eth.getAccounts().then(accounts=>{
      contract.defaults( {gasPrice:15000000, gas:1e9, from:accounts[0]})
    })
  }
  return contract
}

global.contract = async function (name, body) {
  if ( !accounts ) {
    accounts = await web3.eth.getAccounts()
  }
  console.log('this=', this)
  describe(name, function() {
    body(accounts)
  }.bind(this))
}
