// Add filters for conference name. Button for Europe, US, etc.

Vue.component('month-buttons', {
    template: `
        <div class="row filter-group months">
            <div v-for="(value, key) in buttons" class="col-md-1">
                <div @click="applyMonths(value, key)"
                     :class="['month', 'filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyMonths: function(value, key) {
            const index = this.months.indexOf(value.title);

            // Add or remove month from this.months array
            if (index === -1) {
                this.months.push(value.title);
            } else {
                this.months.splice(index, 1);
            }

            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;


            this.$emit('apply-months', this.months);
        }
    },
    data () {
        return {
            months: [],
            buttons: {
                january: {
                    title: 'JAN',
                    active: false
                },
                february: {
                    title: 'FEB',
                    active: false
                },
                march: {
                    title: 'MAR',
                    active: false
                },
                april: {
                    title: 'APR',
                    active: false
                },
                may: {
                    title: 'MAY',
                    active: false
                },
                june: {
                    title: 'JUN',
                    active: false
                },
                july: {
                    title: 'JUL',
                    active: false
                },
                august: {
                    title: 'AUG',
                    active: false
                },
                september: {
                    title: 'SEP',
                    active: false
                },
                october: {
                    title: 'OCT',
                    active: false
                },
                november: {
                    title: 'NOV',
                    active: false
                },
                december: {
                    title: 'DEC',
                    active: false
                }
            }
        }
    }
});

Vue.component('conference', {
    props: {
        conference: {
            type: Object,
            required: true
        }
    },
    template: `
        <div>
            <a href="#" class="conference" aria-expanded="false" aria-controls="collapse">
                <div class="row">
                    <div class="col-md-7">
                        <div class="name">{{ conference.name }}</div>
                        <div class="location text-muted city"><i class="fas fa-map-marker-alt"></i>&nbsp; {{
                            conference.location.city }}, {{ conference.location.country}}
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="row">
                            <div class="col-md-12 date">
                                <span class="float-right"><i class="far fa-calendar-alt"></i>&nbsp; {{ conference.date }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `
});

Vue.component('weather-buttons', {
    template: `
        <div class="row filter-group">
            <div v-for="(value, key) in buttons" class="col-md-4">
                <div @click="applyWeather(value, key)"
                     :class="['filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyWeather: function(value, key) {
            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;

            // Set all other button active values to false
            for (let btn in this.buttons) {
                if (this.buttons[btn].title !== this.buttons[key].title) {
                    this.buttons[btn].active = false;
                }
            }

            if (this.buttons[key].active === false) {
                this.$emit('apply-weather', null, null);
            } else {
                this.$emit('apply-weather', value.temperature.low, value.temperature.high);
            }
        }
    },
    data () {
        return {
            buttons: {
                cold: {
                    title: '❄️ COLD',
                    active: false,
                    temperature: {
                        low: -100,
                        high: 9
                    }
                },
                mild: {
                    title: '🌤️ MILD',
                    active: false,
                    temperature: {
                        low: 10,
                        high: 19
                    }
                },
                warm: {
                    title: '☀️ WARM',
                    active: false,
                    temperature: {
                        low: 20,
                        high: 100
                    }
                }
            }
        }
    }
});

Vue.component('price-buttons', {
    template: `
        <div class="row filter-group">
            <div v-for="(value, key) in buttons" class="col-md-4">
                <div @click="applyPrice(value, key)"
                     :class="['filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyPrice: function(value, key) {
            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;

            // Set all other button active values to false
            for (let btn in this.buttons) {
                if (this.buttons[btn].title !== this.buttons[key].title) {
                    this.buttons[btn].active = false;
                }
            }

            // If the state of the pressed button is false after the press
            // set the global cost to null (i.e. don't apply any cost filter),
            // otherwise set it to the button value.
            if (this.buttons[key].active === false) {
                this.$emit('apply-price', null);
            } else {
                this.$emit('apply-price', value.cost);
            }
        }
    },
    data () {
        return {
            buttons: {
                free: {
                    title: '💰 FREE',
                    active: false,
                    cost: 0,
                },
                low: {
                    title: '💰 < $300 / day',
                    active: false,
                    cost: 1,
                },
                medium: {
                    title: '💰 < $600 / day',
                    active: false,
                    cost: 2,
                }
            }
        }
    }
});

new Vue({
        el: '#conferences',
        data: {
            conferences: window.conferences,
            months: [],
            cost: null,
            temperature: {
                low: null,
                high: null
            },
            city: '',
            country: '',
            speaker: '',
            session: ''

        },
        methods: {
            filterPrice: function() {
                console.log('button pressed');
            },
            updateCost: function(costValue) {
                this.cost = costValue;
            },
            updateWeather: function(temperatureLow, temperatureHigh) {
                this.temperature.low = temperatureLow;
                this.temperature.high = temperatureHigh;
            },
            updateMonths: function(months) {
                this.months = months;
            }
        },
        computed: {
            filteredConferences() {
                return this.conferences.filter(conference => {
                    let cityMatch = conference.location.city.toLowerCase().indexOf(this.city.toLowerCase()) > -1;
                    let countryMatch = conference.location.country.toLowerCase().indexOf(this.country.toLowerCase()) > -1;
                    let speakerMatch = false;
                    let sessionMatch = false;
                    let costMatch = false;
                    let weatherMatch = false;
                    let monthsMatch = true;

                    const date = new Date(conference.startDate * 1000);
                    const locale = 'en-us';
                    const conferenceMonth = date.toLocaleString(locale, { month: "short" }).toUpperCase();

                    if (this.months.length === 0) {
                       monthsMatch = true;
                    } else {
                        monthsMatch = this.months.indexOf(conferenceMonth) > -1;
                    }



                    if (this.temperature.low === null && this.temperature.high === null) {
                        weatherMatch = true;
                    } else if (conference.weather.day >= this.temperature.low && conference.weather.day <= this.temperature.high) {
                        weatherMatch = true;
                    }

                    if (this.cost === null) {
                        costMatch = true;
                    } else {
                        costMatch = conference.cost <= this.cost;
                    }


                    if (conference.sessions.length === 0 && this.speaker === '') {
                        speakerMatch = true;
                    } else {
                        for (let session of conference.sessions) {
                            if (session.speaker.toLowerCase().indexOf(this.speaker.toLowerCase()) > -1) {
                                speakerMatch = true;
                                break;
                            }
                        }
                    }

                    if (conference.sessions.length === 0 && this.session === '') {
                        sessionMatch = true;
                    } else {
                        for (let session of conference.sessions) {
                            if (session.title.toLowerCase().indexOf(this.session.toLowerCase()) > -1) {
                                sessionMatch = true;
                                break;
                            }
                        }
                    }

                    return cityMatch && countryMatch && costMatch && weatherMatch && monthsMatch && speakerMatch && sessionMatch;
                })
            }
        }
    })
;