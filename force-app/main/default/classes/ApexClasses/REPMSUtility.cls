public class REPMSUtility {

    // Check if a string is null, empty, or contains only spaces
    public static Boolean isBlank(String value) {
        return String.isBlank(value);
    }

    // Return today's date
    public static Date getToday() {
        return Date.today();
    }

    // Return today's date plus the specified number of days
    public static Date addDays(Integer numberOfDays) {
        return Date.today().addDays(numberOfDays);
    }

    // Check if a list contains records
    public static Boolean hasRecords(List<SObject> records) {
        return records != null && !records.isEmpty();
    }

}