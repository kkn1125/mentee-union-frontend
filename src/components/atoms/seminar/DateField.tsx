import { timeFormat } from "@/util/tool";
import {
  FormHelperText,
  FormHelperTextProps,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { FocusEventHandler, ReactNode, useEffect, useRef } from "react";

type DateFieldProps = {
  label: string;
  name: string;
  value: Date;
  onChange: (v: Date) => void;
  onBlur?:
    | FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> &
        ((this: HTMLInputElement, ev: FocusEvent) => void);
  error?: boolean;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
};

function DateField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  sx,
  FormHelperTextProps,
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17T15:30"));
  useEffect(() => {
    const current = inputRef.current;
    if (current && onBlur) {
      current.addEventListener("blur", onBlur);
    }
    return () => {
      if (current && onBlur) {
        current.removeEventListener("blur", onBlur);
      }
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        gap={0}
        sx={{
          position: "relative",
        }}>
        <DateTimePicker
          inputRef={inputRef}
          name={name}
          label={label}
          value={dayjs(timeFormat(value, "YYYY-MM-ddTHH:mm:ss"))}
          onChange={(values) => onChange(values ? values.toDate() : new Date())}
          sx={{
            ...sx,
          }}
        />
        {error && (
          <FormHelperText
            sx={{
              color: "error.main",
              position: "absolute",
              top: "100%",
              left: 0,
            }}>
            {helperText}
          </FormHelperText>
        )}
      </Stack>
    </LocalizationProvider>
  );
}

export default DateField;
