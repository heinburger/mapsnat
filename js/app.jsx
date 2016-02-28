'use strict';

var Maps = React.createClass({
  getInitialState: function() {
    return {
      maps: []
    }
  },
  componentWillMount: function() {
    var self = this;
    $.getJSON("/maps", function(result){
      self.setState({maps:result})
    });
  },
  render: function() {
    return (
      <div className="container-fluid">
        { this._renderMaps(this.state.maps) }
      </div>
    )
  },
  _renderMaps: function(maps) {
    return $.map(maps, function(map) {
      return ( <Map map={map} key={map.id} /> )
    })
  }
});

var Map = React.createClass({
  render: function() {
    return (
      <img src={this.props.map.image} />
    )
  }
});

//render the app in the container
ReactDOM.render(<Maps />, document.getElementById('maps'));
