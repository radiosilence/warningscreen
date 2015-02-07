import React from 'react/addons';
import _ from 'lodash';

var Root = React.createClass({
  render() {
    return (
      <div className="root">
        I am root!
      </div>
    );
  }
});

var Overlay = React.createClass({
  render() {
    return (
      <div className="overlay" style={this._getStyle()}>
        <Message />
      </div>
    );
  }
});

var Message = React.createClass({
  render() {
    return (
      <div className="message">
        Message!
      </div>
    );
  }
});


React.render(<Root/>, document.body);