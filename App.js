import React from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Grid} from 'semantic-ui-react'
import _ from "lodash";
import Chart from "react-google-charts";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
//import ReactMapboxGl, { Layer, Feature, ZoomControl } from "react-mapbox-gl";
import Icon from "./form.png";


mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
var map;
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
            points: [
                [-87.6309729, 41.76716449],
                [-87.63097366, 41.76668286],
                [-87.63095643, 41.76619789],
                [-87.63095245, 41.76578],
                [-87.63094033, 41.76561825]
            ],
            zoom: [2],
            center: [32, 32]

        }
    }


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

            //burda kişilerin adresinden ülkeleri labellayıp mapdataya atıcam
            mapdata.push([_.find(this.state.persons, ['id', selected[i]]).address.geo.lat, _.find(this.state.persons, ['id', selected[i]]).address.geo.lng]);
            console.log(mapdata);

        }


        for (var i = 0; i < selected.length; i++) {

            var marker =new mapboxgl.Marker()
                .setLngLat([
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lat,
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lng
                ])
                .addTo(map);
            map.jumpTo({
                center: [
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lat,
                    _.find(this.state.persons, ['id', selected[i]]).address.geo.lng
                ]
            });


        }




        this.setState({
            selected: [...selected],
            data:[...data]
        })


    }

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

        map = new mapboxgl.Map({
            container: 'mapbox-container-1', // container id
            style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            center: [ -37.3159, 81.1496 ], // starting position [lng, lat]
            zoom: 1// starting zoom
        });
    }



    render() {
        const {persons} = this.state;
        const { mapdata, zoom, center } = this.state;
        const image = new Image(20, 30);
        image.src = Icon;
        const images = ["myImage", image];
        const container = {

            width: '100%'

    };
        const first = {
            width: '450px',
            height: '350px',
            float:'left',
            margin:'20px'


        };
        const second = {
            float:'left',
            width: 'auto',
            height: '200px',
            margin: '100px'
        };
        const pieOptions = {
            title: "Pie Chart",
            pieHole: 0.3,
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
            </div>


        )
    }
}