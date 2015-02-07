import React from 'react/addons';
import _ from 'lodash';
import raf from 'raf';
import reqwest from 'reqwest';
 
var Root = React.createClass({
  getInitialState() {
    return {progress: 0};
  },
  componentDidMount() {
    var start;
    var step = (timestamp) => {
      if (!start) start = timestamp;
      this.setState({progress: timestamp - start})
      raf(step);
    };
    this.raf = raf(step);
  },
  componentWillUnmount() {
    this.raf.cancel();
  },
  render() {
    return (
      <div className="root">
        <Overlay progress={this.state.progress} />
      </div>
    );
  }
});

var PERIOD = 8;
var Overlay = React.createClass({
  waves: {
    'sin': (x) => (Math.sin(x) / 2) + .5,
    'flat': (x) => (x % PERIOD) / (PERIOD / 2)
  },
  getInitialState() {
    return {
      wave: 'flat'
    };
  },
  render() {
    var alpha = this._getAlpha();
    return (
      <div className="overlay" style={this._getStyle(alpha)}>
        <Message />
      </div>
    );
  },
  _onSelectWave(event) {
    this.setState({
      wave: event.target.value
    });
  },
  _getWaveSelectorNode() {
    <select type="select" value={this.state.wave} onChange={this._onSelectWave}>
      {_.keys(this.waves).map(wave => (
        <option value={wave}>{wave}</option>
      ))}
    </select>   

  },
  _getAlpha(x) {
    var x = this.props.progress / 1000;
    var y = this.waves[this.state.wave](x);
    return y > 1 ? 2 - y : y;
  },
  _getStyle(alpha) {
    return {
      backgroundColor: `rgba(255, 0, 0, ${alpha})`
    };
  }
});

var Message = React.createClass({
  getInitialState() {
    return {
      shown: true
    };
  },
  componentDidMount() {
    this.toggler = setInterval(() => {
      reqwest({
        url: '/api/status'
      }).then(res => {
        this.setState({
          shown: !this.state.shown,
          status: res
        });
      })

    }, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.toggler);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shown != this.state.shown;
  },
  render() {
    console.log("msg status", this.state);
    return (
      <div className="message" style={this._getStyle()}>
        Warning: System offline<br/>
        <br/>
        No signals detected<br/>
        Critical infrastructure failure<br/>
        <br/>
        atmosphere radiation level: high<br/>
        water radiation level: high<br/>
        atmosphere: toxic<br/>
        <br/>
        {this.state.status ? (
          `Devices connected: ${this.state.status.devices.length}`
        ) : null}
        <br/>
        {this.state.status ? (
          this.state.status.devices.map(device => device.mac).join('::')
        ) : null}
      </div>
    );
  },
  _getStyle() {
    return {
      opacity: this.state.shown ? 1 : 0
    };
  }
});


React.render(<Root/>, document.body);