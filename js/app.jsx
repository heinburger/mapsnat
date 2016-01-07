'use strict';

//react-boostrap classes
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

//page number
var pageNumber = 1;

var BranchComponent = React.createClass({
  getInitialState: function() {
    return {
      page:'init'
    }
  },
  render: function() { 
    return (
      <div className="root-component">
        <input type="text" />
        {this.getPage() === 'init' ? (<Go click={this.change} />) : (<Maps />)}
      </div>
    );
  },
  getPage: function() {
    return this.state.page
  },
  change: function() {
    this.setState({page:'ready'})
  }
});

var Go = React.createClass({
  render: function() {
    return (
      <div className="click-me">
        <Button className="resmio-button" onClick={this.props.click}>
          Click Me
        </Button>
      </div>
    );
  }
});

var Maps = React.createClass({
  getInitialState: function() {
    return {
      page: pageNumber,
      maps: []
    }
  },
  componentWillMount: function() {
    var self = this;
    $.getJSON("/maps/1", function(results){
      var items;
      items = results.nyplAPI.response.result;
      self.setState({maps:items})
    });
  },
  add: function(time) {

  },
  render: function() {
    return (
      <div className="container-fluid">
        <ListMaps maps={this.state.maps} />
      </div>
    )
  }
});

var ListMaps = React.createClass({
  render: function() {
    var self = this;

    //loop over all the times
    var renderReturn = this.props.maps.map(function(item,i){
      var modalId = "modal"+i
      return <h2></h2>;
    });
    return (
      <div className="list-holder">
          {renderReturn}
      </div>
    )
  }
});

//render the app in the container
ReactDOM.render(<BranchComponent />, document.getElementById('maps'));
