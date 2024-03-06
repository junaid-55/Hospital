CREATE OR REPLACE FUNCTION check_appointment() RETURNS TRIGGER AS $$
DECLARE
    appointments_count_patient INT;
    appointment_count_doc INT;
BEGIN
    SELECT COUNT(*) INTO appointments_count_patient
    FROM appointment
    WHERE patient_id = NEW.patient_id AND doctor_id = NEW.doctor_id AND appointment_date = NEW.appointment_date;

    SELECT COUNT(*) INTO appointment_count_doc
    FROM appointment
    WHERE doctor_id = NEW.doctor_id AND appointment_date = NEW.appointment_date;


    IF appointments_count_patient > 0 THEN
        RAISE EXCEPTION 'A patient cannot have two appointments with same doctor on the same day.';
    ELSIF appointment_count_doc > 10 THEN
        RAISE EXCEPTION 'This doctor has enough appointments for the day. Please choose another day.';
    ELSIF NEW.appointment_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Appointment date cannot be in the past.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_trigger
BEFORE INSERT ON appointment
FOR EACH ROW
EXECUTE FUNCTION check_appointment();