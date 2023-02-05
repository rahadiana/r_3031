
const {
    OpdData
}
= require( '../src/factory/HttpRequest')

OpdData(process.argv.slice(2)[1],"subunit","103602010000",process.argv.slice(2)[0]).then(console.log).catch(console.error)