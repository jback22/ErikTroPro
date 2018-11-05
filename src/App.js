import React from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import _ from "lodash";
import Chart from "react-google-charts";
import Control from 'react-leaflet-control';
import { Map, Marker, Popup, TileLayer, ZoomControl, ScaleControl } from 'react-leaflet';


const TOKEN="pk.eyJ1IjoiemFmZmEiLCJhIjoiY2pvMGRyZHhwMHR1bTNxbGpuMzMwMWJ5eSJ9.-evEOb2m5B3LftZjo9KziA";

export default class PersonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            persons: null,
            selected: [],
            posts: null,
            all: null,
            data: null,
            mapdata: [],
            markers: [[51.505, -0.09]]

        }
    }

    addMarker = (e) => {
        const {markers} = this.state
        markers.push(e.latlng)
        this.setState({markers})
    }

    onClick(key, event){
        let data= [["UserName", "PostCount"]]
        let mapdata=[["Lat", "Long"]];
        let selected = this.state.selected;

        if (_.includes(selected, key + 1)) {
            _.remove(selected, function (n) {
                return n === (key + 1);
            });
        } else {
            selected.push(key + 1);
        }

        for(var i=0; i<_.size(selected);i++)
        {
            data.push( [_.find(this.state.persons,['id',selected[i]]).name,_.find(this.state.all,['id',selected[i]]).postcount]);

            //burda kişilerin adresinden ülkeleri labellayıp mapdataya atıcam
            mapdata.push( [_.find(this.state.persons,['id',selected[i]]).address.geo.lat ,_.find(this.state.persons,['id',selected[i]]).address.geo.lng]);
            console.log(mapdata);
        }

        this.setState({
            selected: [...selected],
            data:[...data]
        })

    }

    componentDidMount() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.innerHTML = "document.write('This is output by document.write()!')";
        this.instance.appendChild(s);

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

        Promise.all([promise1, promise2]).then(()=>{
            persons.map(person => {
                let id = person.id;
                let postcount = 0;
                _.map(posts, post => {
                    if (post.userId === id) {
                        postcount++;

                    }
                });
                withpost.push({
                    "id": id,
                    "postcount": postcount
                })
            });

            this.setState({all: [...withpost]});
        });
    }

    render() {
        const {persons} = this.state;
        const pieOptions = {
            title: "",
            pieHole: 0.6,
            slices: [{
                color: "#2BB673"
            },
                {
                    color: "#d91e48"
                },
                {
                    color: "#007fad"
                },
                {
                    color: "#e9a227"
                }
            ],
            legend: {
                position: "bottom",
                alignment: "center",
                textStyle: {
                    color: "233238",
                    fontSize: 14
                }
            },
            tooltip: {
                showColorCode: true
            },
            chartArea: {
                left: 0,
                top: 0,
                width: "100%",
                height: "80%"
            },
            fontName: "Roboto"
        };

        return (
            <div>
                <div>
                    <Map
                        center={[51.505, -0.09]}
                        onClick={this.addMarker}
                        zoom={13}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        {this.state.markers.map((position, idx) =>
                            <Marker key={`marker-${idx}`} position={position}>
                                <Popup>
                                    <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                                </Popup>
                            </Marker>
                        )}
                    </Map>
                </div>
                <Chart
                    chartType="PieChart"
                    data={this.state.data}
                    options={pieOptions}
                    graph_id="PieChart"
                    width={"100%"}
                    height={"400px"}
                    legend_toggle
                />
                <table border="1">
                    <thead>
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
                    </thead>
                    <tbody>
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
                    </tbody>

                </table>
            </div>

        )
    }
}