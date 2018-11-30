This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Accessing project

### `you can find the project in this domain` 

Runs the app in the this domain.<br>
Open [http://eriktropro.surge.sh](http://eriktropro.surge.sh) to view it in the browser.

## About Project

I was given a project about reactjs.I havent do anything about react before.I start with searching what react does.
After got something about react I create a default reactjs app.I used Webstorm to do the project.
I was expected to do a web page which includes Map , pie chart and table part.Table shows users informations which are come from an Api.
Table has a selectbox to choose a user to show it's Post count and Location.I use google-pie-chart for Pie Chart and Mapbox-gl for Map.
When you choose a user with clicking selectbox its informations goes to piechart and map.

This is my return func in render.Table's code is here.To configure table css I use semantic-ui-react.
```
return (

            <div style={container}>
                <div id="mapbox-container-1" style={first}></div>
                <div style={second}>
                    <Chart
                        chartType="PieChart"
                        data={this.state.data}
                        options={pieOptions}
                        graph_id="PieChart"
                        width={"400px"}
                        height={"300px"}
                        legend_toggle
                    />
                </div>
                <div>
                    <Table compact celled definition>
                        <Table.Header>
                        <tr>
                            <th>select</th>
                            <th>id</th>
                            <th>name</th>
                            <th>username</th>
                            <th>email</th>
                            <th>address</th>
                            <th>phone</th>
                            <th>website</th>
                            <th>company</th>

                        </tr>
                        </Table.Header>
                        <Table.Body>
                        {persons && persons.map((persons, key) => {
                            return (
                                <tr key={key}>
                                    <td><input type="checkbox" name="" value="" onClick={this.onClick.bind(this,key)}/></td>
                                    <td>{persons.id}</td>
                                    <td>{persons.name}</td>
                                    <td>{persons.username}</td>
                                    <td>{persons.email}</td>
                                    <td>{persons.address.city}</td>
                                    <td>{persons.phone}</td>
                                    <td>{persons.website}</td>
                                    <td>{persons.company.name}</td>
                                </tr>
                            )
                        })}
                        </Table.Body>
                    </Table>
                </div>
            </div>
```
.map functions allows to use persons list one by one.For a better learn check [here](https://reactjs.org/docs/lists-and-keys.html).

```
<Table.Body>
                        {persons && persons.map((persons, key) => {
                            return (
```

In my onClick function,I am getting keys from table selectbox and push infos to ```data[]``` ```and mapdata[]``` and use them in piechart and map.


```
onClick(key, event) {
        let data = [["UserName", "PostCount"]]
        let mapdata = [["Lat", "Long"]];
        let selected = this.state.selected;

        if (_.includes(selected, key + 1)) {
            _.remove(selected, function (n) {
                return n === (key + 1);
            });
        } else {
            selected.push(key + 1);
        }

        for (var i = 0; i < selected.length; i++) {
            data.push([_.find(this.state.persons, ['id', selected[i]]).name, _.find(this.state.all, ['id', selected[i]]).postcount]);
            mapdata.push([_.find(this.state.persons, ['id', selected[i]]).address.geo.lat, _.find(this.state.persons, ['id', selected[i]]).address.geo.lng]);

        }


        for (var i = 0; i < selected.length; i++) {

            var marker =new mapboxgl.Marker()
                .setLngLat([
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lng,
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lat
                ])
                .addTo(map);
            map.jumpTo({
                center: [
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lng,
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lat
                ]
            });


        }

```
Marker() function add marker to selected user lnglag info on map. 

```
	var marker =new mapboxgl.Marker()
                .setLngLat([
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lng,
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lat
                ]) 
```

I used [axios](https://alligator.io/react/axios-react/) to get data from Api.

```
componentDidMount() {


        let posts = [];
        let persons = [];
        let withpost = [];

        var promise1 = axios.get(`https://jsonplaceholder.typicode.com/users`).then(res => {
            persons = [...res.data];
            this.setState({
                persons: [...res.data]
            });
        });
        var promise2 = axios.get(` https://jsonplaceholder.typicode.com/posts`).then(res => {
            posts = [...res.data];
            this.setState({
                posts: [...res.data]
            });

        });

```


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
