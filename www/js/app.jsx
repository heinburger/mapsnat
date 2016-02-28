'use strict';

var Maps = React.createClass({
  getInitialState: function() {
    return {
      mapNum: 1
    }
  },
  render: function() {
    return (
      <div className="container-fluid">
        <div style={{position:'relative', width:'80%', margin:'0 auto', textAlign:'center'}}>
          <button className={ this.state.mapNum === 1 ? 'hidden' : ''} style={{position:'absolute', top:0, left:0}} onClick={ this._prevMap }>Prev</button>
          <button style={{position:'absolute', top:0, right:0}} onClick={ this._nextMap }>Next</button>
          <Map map={this.state.mapNum} />
        </div>
      </div>
    )
  },

  _nextMap: function() {
    var next = this.state.mapNum + 1
    this.setState({mapNum:next})
  },
  _prevMap: function() {
    var next = this.state.mapNum - 1
    this.setState({mapNum:next})
  }
});

var Map = React.createClass({
  getInitialState: function(){
    return {
      map:[]
    }
  },
  componentWillMount: function() {
    var self = this;
    $.getJSON("/maps/"+this.props.map, function(result){
      self.setState({map:result[0]})
    });
  },
  render: function() {
    return (
      <img style={{maxWidth:'100%'}} src={this.state.map.image} />
    )
  },
  componentWillReceiveProps: function(prop) {
    var self = this;
    $.getJSON("/maps/"+prop.map, function(result){
      self.setState({map:result[0]})
    });
  }
});

//render the app in the container
ReactDOM.render(<Maps />, document.getElementById('maps'));
