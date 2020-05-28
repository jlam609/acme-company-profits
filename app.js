const { Component } = React
const { render } = ReactDOM
const { Switch, Link, Route, HashRouter, Redirect } = ReactRouterDOM
const companies = axios.get('https://acme-users-api-rev.herokuapp.com/api/companies')


class Home extends Component{
	render(){
		return <h1>Welcome!</h1>
	}
}
class CompaniesList extends Component{
	state = {
		profits:[]
	}
	productList = (e) => {
		console.log(window.location.hash.slice(1))
		const companyId = window.location.hash.slice(1)
		axios.get(`https://acme-users-api-rev.herokuapp.com/api${companyId}/companyProfits`)
		.then(res => {
			const profits = res.data.map((profit, idx) => {
				return (
				<ul key ={idx}>
					<li style = {{
						width:'100%',
						border:'black solid 1px',
						textAlign: 'left',
					}}>{profit.fiscalYear.slice(0,4)} {profit.amount}</li>
				</ul>
				)	
			})
			this.setState({
				profits:profits
			})
		})
	} 
	render(){
	const {companies} = this.props
	const {profits} = this.state
	const companyList = companies.map((company,idx) => {
		return <Link key={idx} to={`/companies/${company.id}`} onClick = {this.productList}>
		<li>{company.name}</li>
		</Link>
	})
	return <div style = {{
		display:'flex',
		flexDirection:'row',
		width:'100%',
		justifyContent:'space-apart'
	}}>
		<div>{companyList}</div>
		<div><ul>{profits}</ul></div>
		</div>
	}
}

class App extends Component {
	state = {
		companies:[],
		profits:[],
		view:'companies'
	}
	componentDidMount = () => {
		companies.then(res => {
		this.setState({
			companies:res.data,
		})
	})
	}
	render() {
		const {companies, profits, view} = this.state
		return (
			<HashRouter>
			<div>
				<nav>
			<Link to ={'/home'}>Acme Company Profits With ReactRouter</Link>
			<Link to ={'/companies'}> Companies </Link>
			</nav>
			<Switch>
				<Route path = {'/home'}  component = {Home}></Route>
				<Route path = {'/companies/:id?'} ><CompaniesList companies = {companies}/></Route>
			</Switch>
			</div>
			</HashRouter>
		)
	}
}
const root = document.querySelector("#root")
render(<App />, root)
