import React, { Component } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import classes from './ManageIcons.css';
import buttonClasses from '../../components/AddButton/AddButton.css';

class ManageIcons extends Component {
    state = {
        icon: {},
        iconList: []
    }

    componentDidMount(){
        axios('/api/icons/icons').then(res => {
            const {icon, iconList} = res.data.icons;
            this.setState({
                icon,
                iconList
            })
        })
        .catch(({response}) => {
            toast.error(response.data.message)
        })
    }

    updateIcons = (e, icon) => {
        const newIcon = {
            ...this.state.icon,
            [icon]: e.target.value
        }
        this.setState({icon: newIcon});
    }

    sendIcons = () => {
        axios('/api/icons', {
            method: 'PATCH',
            data: {
                icon: this.state.icon
            }
        }).then(() => toast.success('Đổi icon thành công'))
        .catch(({response}) => toast.error(response.data.message))
    }

    render() {
        return (
          <div className={classes.manageIcons}>
            {Object.keys(this.state.icon).map(icon => (
              <div className={classes.iconsCard} key={icon}>
                <p>{icon}</p>
                <select
                  value={this.state.icon[icon]}
                  onChange={e => this.updateIcons(e, icon)}
                >
                  {this.state.iconList.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button className={buttonClasses.buttonSmall} onClick={this.sendIcons}>Update Icons</button>
          </div>
        );
    }
}

export default ManageIcons;