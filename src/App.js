import React from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import _ from "lodash";
import Chart from "react-google-charts";
import ReactMapboxGl, { Layer, Feature, ZoomControl } from "react-mapbox-gl";
import Icon from "./form.png";


const TOKEN="pk.eyJ1IjoiemFmZmEiLCJhIjoiY2pvMGRyZHhwMHR1bTNxbGpuMzMwMWJ5eSJ9.-evEOb2m5B3LftZjo9KziA";
const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiemFmZmEiLCJhIjoiY2pvMGRyZHhwMHR1bTNxbGpuMzMwMWJ5eSJ9.-evEOb2m5B3LftZjo9KziA"
});

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

    handleClick = (map, ev) => {
        const { lng, lat } = ev.lngLat;
        var { mapdata } = this.state;
        mapdata = [...mapdata, [lng, lat]];
        const zoom = [map.transform.tileZoom + map.transform.zoomFraction];
        this.setState({
            mapdata,
            zoom,
            center: map.getCenter()
        });
    };

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
        const { mapdata, zoom, center } = this.state;
        const image = new Image(20, 30);
        image.src = Icon;
        const images = ["myImage", image];
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
            <div >
                <div >
                    <Map
                        style="mapbox://styles/mapbox/streets-v9"
                        zoom={zoom}
                        center={center}
                        containerStyle={{ height: 400, width: 500 }}
                        onClick={this.handleClick}
                    >
                        <Layer
                            type="symbol"
                            id="mapdata"
                            layout={{ "icon-image": "myImage", "icon-allow-overlap": true }}
                            images={images}
                        >
                            {mapdata.map((point, i) => <Feature key={i} coordinates={point} />)}
                        </Layer>
                    </Map>
                </div>
                <div >
                    <Chart
                        chartType="PieChart"
                        data={this.state.data}
                        options={pieOptions}
                        graph_id="PieChart"
                        width={"100%"}
                        height={"400px"}
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