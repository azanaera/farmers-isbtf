package ext.utilities

uses gw.api.locale.DisplayKey

class UIContactUtil {
  /**
   * This method sets the corresponding label if the frequency type of recurrence is selected to 'Other'
   * @param contact
   * @return String
   */
  static function setRecurrenceDaysLabel(contact : ABContact) : String {
    if (contact.CheckRecurrenceType_Ext == CheckRecurrenceType_Ext.TC_WEEKLY) {
      return DisplayKey.get("Toggle.Web.Contacts.Recurrence.SubsequentChecks.Frequency.WeeklyFormat_Ext")
    } else if (contact.CheckRecurrenceType_Ext == CheckRecurrenceType_Ext.TC_MONTHLY) {
      return DisplayKey.get("Toggle.Web.Contacts.Recurrence.SubsequentChecks.Frequency.MonthlyFormat_Ext")
    } else {
      return DisplayKey.get("Toggle.Web.Contacts.Recurrence.SubsequentChecks.Frequency.DailyFormat_Ext")
    }
  }

  /**
   * This method resets recurrence fields values if its modified after getting saved
   * @param contact
   */
  static function resetRecurrenceValues(contact : ABContact){
    if (contact.CheckRecurrenceType_Ext != null ){
      contact.RecurrenceNumber_Ext = null
      contact.MntlyRecurnceDateType_Ext = null
      contact.RecurrenceDate_Ext = null
      contact.RecurrenceWeek_Ext = null
      contact.RecurrenceDay_Ext = null
      contact.IssueChkInAdvanceInd_Ext = null
      contact.DaysinAdvance_Ext = null
    }
  }
}