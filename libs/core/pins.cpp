#include "pxt.h"

#include "DeviceSystemTimer.h"

#define DEFPIN(id, name, cap) id(DEVICE_ID_IO_P0 + (&id - pins), (PinName)(name), cap)
#define PIN_V(id) PIN_##id
#define PIN_AD(id) DEFPIN(id, PIN_V(id), PIN_V(id) ? PIN_CAPABILITY_AD : (PinCapability)0)
#define PIN_D(id) DEFPIN(id, PIN_V(id), PIN_V(id) ? PIN_CAPABILITY_DIGITAL : (PinCapability)0)

DevPins io;

DevPins::DevPins()
    : PIN_AD(A0), PIN_AD(A1), PIN_AD(A2), PIN_AD(A3), PIN_AD(A4), PIN_AD(A5), PIN_AD(A6), PIN_D(D0),
      PIN_D(D1), PIN_D(D2), PIN_D(D3), PIN_D(D4), PIN_D(D5), PIN_D(D6), PIN_D(D7), PIN_D(D8),
      PIN_D(D9), PIN_D(D10), PIN_D(D11), PIN_D(D12), PIN_D(D13), PIN_D(LED), PIN_D(LEDRX),
      PIN_D(LEDTX), PIN_D(MOSI), PIN_D(MISO), PIN_D(SCK), PIN_D(SDA), PIN_D(SCL) {}

static DevicePin *pitchPin = NULL;

enum class PulseValue {
    //% block=high
    High = DEVICE_PIN_EVT_PULSE_HI,
    //% block=low
    Low = DEVICE_PIN_EVT_PULSE_LO
};

enum class PinPullMode {
    //% block="down"
    PullDown = 0,
    //% block="up"
    PullUp = 1,
    //% block="none"
    PullNone = 2
};

namespace pins {
//%
DevicePin *getPin(int id) {
    if (!(0 <= id && id <= LastPinID))
        device.panic(42);
    DevicePin *p = &io.pins[id];
    // if (p->name == PA00)
    //    return NULL;
    return p;
}
}

#define PINOP(op) name->op

#define PINREAD(op) return name->op

namespace DigitalPinMethods {
/**
 * Read the specified pin or connector as either 0 or 1
 * @param name pin to read from
 */
//% help=pins/digital-read-pin weight=30
//% blockId=device_get_digital_pin block="digital read|pin %name" blockGap=8
//% blockNamespace=pins
int digitalRead(DigitalPin name) {
    PINREAD(getDigitalValue());
}

/**
  * Set a pin or connector value to either 0 or 1.
  * @param name pin to write to
  * @param value value to set on the pin, 1 eg,0
  */
//% help=pins/digital-write-pin weight=29
//% blockId=device_set_digital_pin block="digital write|pin %name|to %value"
//% blockNamespace=pins
void digitalWrite(DigitalPin name, int value) {
    PINOP(setDigitalValue(value));
}

/**
* Configures this pin to a digital input, and generates events where the timestamp is the duration
* that this pin was either ``high`` or ``low``.
*/
//% help=pins/on-pulsed weight=22 blockGap=8 advanced=true
//% blockId=pins_on_pulsed block="on|pin %pin|pulsed %pulse"
//% blockNamespace=pins
void onPulsed(DigitalPin pin, PulseValue pulse, Action body) {
    pin->eventOn(DEVICE_PIN_EVENT_ON_PULSE);
    registerWithDal((int)pin->name, (int)pulse, body);
}

/**
* Returns the duration of a pulse in microseconds
* @param name the pin which measures the pulse
* @param value the value of the pulse (default high)
* @param maximum duration in micro-seconds
*/
//% blockId="pins_pulse_in" block="pulse in (µs)|pin %name|pulsed %value"
//% weight=20 advanced=true
//% blockNamespace=pins
int pulseIn(DigitalPin pin, PulseValue value, int maxDuration = 2000000) {
    int pulse = value == PulseValue::High ? 1 : 0;
    uint64_t tick = system_timer_current_time_us();
    uint64_t maxd = (uint64_t)maxDuration;
    while (pin->getDigitalValue() != pulse) {
        if (system_timer_current_time_us() - tick > maxd)
            return 0;
    }

    uint64_t start = system_timer_current_time_us();
    while (pin->getDigitalValue() == pulse) {
        if (system_timer_current_time_us() - tick > maxd)
            return 0;
    }
    uint64_t end = system_timer_current_time_us();
    return end - start;
}

/**
* Configures the pull of this pin.
* @param name pin to set the pull mode on
* @param pull one of the mbed pull configurations: PullUp, PullDown, PullNone
*/
//% help=pins/set-pull weight=3 advanced=true
//% blockId=device_set_pull block="set pull|pin %pin|to %pull"
//% blockNamespace=pins
void setPull(DigitalPin name, PinPullMode pull) {
    PinMode m = pull == PinPullMode::PullDown ? PinMode::PullDown : pull == PinPullMode::PullUp
                                                                        ? PinMode::PullUp
                                                                        : PinMode::PullNone;
    PINOP(setPull(m));
}
}

namespace AnalogPinMethods {

/**
 * Read the connector value as analog, that is, as a value comprised between 0 and 1023.
 * @param name pin to write to
 */
//% help=pins/analog-read-pin weight=25
//% blockId=device_get_analog_pin block="analog read|pin %name" blockGap="8"
//% blockNamespace=pins
int analogRead(AnalogPin name) {
    PINREAD(getAnalogValue());
}

/**
 * Set the connector value as analog. Value must be comprised between 0 and 1023.
 * @param name pin name to write to
 * @param value value to write to the pin between ``0`` and ``1023``. eg:1023,0
 */
//% help=pins/analog-write-pin weight=24
//% blockId=device_set_analog_pin block="analog write|pin %name|to %value" blockGap=8
//% blockNamespace=pins
void analogWrite(AnalogPin name, int value) {
    PINOP(setAnalogValue(value));
}

/**
 * Configures the Pulse-width modulation (PWM) of the analog output to the given value in
 * **microseconds** or `1/1000` milliseconds.
 * If this pin is not configured as an analog output (using `analog write pin`), the operation has
 * no effect.
 * @param name analog pin to set period to
 * @param micros period in micro seconds. eg:20000
 */
//% help=pins/analog-set-period weight=23 blockGap=8
//% blockId=device_set_analog_period block="analog set period|pin %pin|to (µs)%micros"
//% blockNamespace=pins
void analogSetPeriod(AnalogPin name, int micros) {
    PINOP(setAnalogPeriodUs(micros));
}

/**
 * Writes a value to the servo, controlling the shaft accordingly. On a standard servo, this will
 * set the angle of the shaft (in degrees), moving the shaft to that orientation. On a continuous
 * rotation servo, this will set the speed of the servo (with ``0`` being full-speed in one
 * direction, ``180`` being full speed in the other, and a value near ``90`` being no movement).
 * @param name pin to write to
 * @param value angle or rotation speed, eg:180,90,0
 */
//% help=pins/servo-write-pin weight=20
//% blockId=device_set_servo_pin block="servo write|pin %name|to %value" blockGap=8
//% parts=microservo trackArgs=0
//% blockNamespace=pins
void servoWrite(AnalogPin name, int value) {
    PINOP(setServoValue(value));
}

/**
 * Configures this IO pin as an analog/pwm output, configures the period to be 20 ms, and sets the
 * pulse width, based on the value it is given **microseconds** or `1/1000` milliseconds.
 * @param name pin name
 * @param micros pulse duration in micro seconds, eg:1500
 */
//% help=pins/servo-set-pulse weight=19
//% blockId=device_set_servo_pulse block="servo set pulse|pin %value|to (µs) %micros"
//% blockNamespace=pins
void servoSetPulse(AnalogPin name, int micros) {
    PINOP(setServoPulseUs(micros));
}

}

namespace pins {
/**
 * Create a new zero-initialized buffer.
 * @param size number of bytes in the buffer
 */
//%
Buffer createBuffer(int size) {
    return ManagedBuffer(size).leakData();
}

/**
* Gets the duration of the last pulse in micro-seconds. This function should be called from a
* ``onPulsed`` handler.
*/
//% help=pins/pulse-duration advanced=true
//% blockId=pins_pulse_duration block="pulse duration (µs)"
//% weight=21 blockGap=8
int pulseDuration() {
    return pxt::lastEvent.timestamp;
}


/**
 * Sets the pin used when using `analog pitch` or music.
 * @param name pin to modulate pitch from
 */
//% blockId=device_analog_set_pitch_pin block="analog set pitch pin %name"
//% help=pins/analog-set-pitch weight=3 advanced=true
void analogSetPitchPin(AnalogPin name) {
    pitchPin = name;
}

/**
 * Emits a Pulse-width modulation (PWM) signal to the current pitch pin. Use `analog set pitch pin`
 * to define the pitch pin.
 * @param frequency frequency to modulate in Hz.
 * @param ms duration of the pitch in milli seconds.
 */
//% blockId=device_analog_pitch block="analog pitch %frequency|for (ms) %ms"
//% help=pins/analog-pitch weight=4 async advanced=true blockGap=8
void analogPitch(int frequency, int ms) {
    if (pitchPin == NULL)
        analogSetPitchPin(&io.A0);
    if (frequency <= 0) {
        pitchPin->setAnalogValue(0);
    } else {
        pitchPin->setAnalogValue(512);
        pitchPin->setAnalogPeriodUs(1000000 / frequency);
    }

    if (ms > 0) {
        fiber_sleep(ms);
        pitchPin->setAnalogValue(0);
        // TODO why do we use wait_ms() here? it's a busy wait I think
        wait_ms(5);
    }
}


}