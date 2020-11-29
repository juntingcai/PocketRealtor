import React from 'react';
import NumberFormat from 'react-number-format';


const NumberFormatCustom = (props) => {

  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

export default NumberFormatCustom

// export default function FormattedInputs() {
//   const classes = useStyles();
//   const [values, setValues] = React.useState({
//     textmask: '(1  )    -    ',
//     numberformat: '1320',
//   });

//   const handleChange = (event) => {
//     setValues({
//       ...values,
//       [event.target.name]: event.target.value,
//     });
//   };

//   return (
//     <div className={classes.root}>
      
//       <TextField
//         label="react-number-format"
//         value={values.numberformat}
//         onChange={handleChange}
//         name="numberformat"
//         id="formatted-numberformat-input"
//         InputProps={{
//           inputComponent: NumberFormatCustom,
//         }}
//       />
//     </div>
//   );
// }
