var ltmDBUser = 'japostol@ics.forth.gr';
var ltmDB = {
	inbox: [
		{ senter: 'a@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '1' },
		{ senter: 'a123@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '2' },
		{ senter: 'a234@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '3' },
		{ senter: 'a34@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '4' },
		{ senter: 'dfga@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '5' },
		{ senter: 'gdfga@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '6' },
		{ senter: 'aasx@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '7' },
		{ senter: 'asdf@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a1' },
		{ senter: 'asdf123@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a2' },
		{ senter: 'a2sdf34@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a3' },
		{ senter: 'a3sdf4@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a4' },
		{ senter: 'dfsdfga@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a5' },
		{ senter: 'gdsdffga@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a6' },
		{ senter: 'aasdfsx@a.com', to: ltmDBUser, date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: 'a7' }
	],

	sent: [
		{ senter: ltmDBUser, to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '8' },
		{ senter: ltmDBUser, to: 'asd@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '9' },
		{ senter: ltmDBUser, to: 'dfa@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '10' },
		{ senter: ltmDBUser, to: 'nma@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '11' },
		{ senter: ltmDBUser, to: 'fa@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '12' },
		{ senter: ltmDBUser, to: 'bna@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '13' },
		{ senter: ltmDBUser, to: 'gdfa@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '14' }
	],

	trash: [
		{ senter: 'hjka@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '15' },
		{ senter: 'axcv@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '16' },
		{ senter: 'axcv@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '17' },
		{ senter: 'asd@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '18' },
		{ senter: 'agh@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '19' },
		{ senter: 'agh@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '20' },
		{ senter: 'ayui@a.com', to: 'adfg@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '21' }
	],

	draft: [
		{ senter: ltmDBUser, to: 'nfga@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '22' },
		{ senter: ltmDBUser, to: 'fgha@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '23' },
		{ senter: ltmDBUser, to: 'ktuya@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '24' },
		{ senter: ltmDBUser, to: 'fhja@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '25' },
		{ senter: ltmDBUser, to: 'fga@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '26' },
		{ senter: ltmDBUser, to: 'sdfa@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '27' },
		{ senter: ltmDBUser, to: 'yua@a.com', date: '26/05/2015', title: 'this is an email title', body: 'this is an email body', id: '28S' }
	]
};