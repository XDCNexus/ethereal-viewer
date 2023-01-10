import React, { useEffect, useState, useRef, Component } from "react";
import './timerstyles.css';
import * as s from "./styles/globalStyles";
import styled from "styled-components";

class CountDown extends React.Component {
    state = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    };

    componentDidMount() {
        this.setDate();
        this.counter();
    }

    setDate = () => {
        const contDownDate = new Date("March 22, 2022 00:01:00").getTime();
        const currentDate = new Date().getTime();

        this.distance = contDownDate - currentDate;

        if (this.distance < 0) {
            clearInterval(this.timer);
            this.setState({
                isExpired: true,
            });
        } else {
            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            this.setState({
                days: Math.floor(this.distance / day),
                hours: Math.floor((this.distance % day) / hour),
                minutes: Math.floor((this.distance % hour) / minute),
                seconds: Math.floor((this.distance % minute) / second),
                isExpired: false,
            });
        }
    };

    counter = () => {
        this.timer = setInterval(() => {
            this.setDate();
        }, 1000);
    };

    render() {
        const { days, hours, minutes, seconds, isExpired } = this.state;
        return (
            <div>
                <div className="new-year-container">
                    <h2>THE PLEDGE Phase Ends In</h2>
                    <div className="time-box">
                        <div className="days">
                            <h2>{days}</h2>
                            <p>DAYS</p>
                        </div>
                        <div className="hours">
                            <h2>{hours}</h2>
                            <p>HOURS</p>
                        </div>
                        <div className="minutes">
                            <h2>{minutes}</h2>
                            <p>MINUTES</p>
                        </div>
                        <div className="seconds">
                            <h2>{seconds}</h2>
                            <p>SECONDS</p>
                        </div>
                    </div>
                </div>
                <s.TextTitle
                    style={{
                        textAlign: "center",
                        color: "white",
                    }}
                >
                    When the Nexus Pledge/Mint phase is over, the snapshot is taken, and the airdrop is completed the DEX will be live at Nexus.io.

                </s.TextTitle>
            </div>
        );
    }
}

export default CountDown;
