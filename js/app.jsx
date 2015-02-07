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


React.render(<Root/>, document.body);