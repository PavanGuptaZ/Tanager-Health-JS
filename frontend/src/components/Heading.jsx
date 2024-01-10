import PropTypes from 'prop-types';

export const Heading = ({
    text = 'Heading',
    size, color,
    weight = 500,
    upper
}) => {
    return (
        <div style={{
            color,
            textAlign: "center",
            fontSize: size + "rem",
            fontWeight: weight,
            margin: "0.5rem 0",
            textTransform: upper ? "uppercase" : "capitalize"
        }}>{text}</div>
    )
}

Heading.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    weight: PropTypes.number,
    upper: PropTypes.bool
}