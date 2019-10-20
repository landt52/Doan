import React, {Component} from 'react';
import classes from './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error){
    return {hasError: true}
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes.ErrorImageOverlay}>
          <div className={classes.ErrorImageContainer} />
          <div className={classes.ErrorImageText}>Something went wrong</div>
        </div>
      )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
