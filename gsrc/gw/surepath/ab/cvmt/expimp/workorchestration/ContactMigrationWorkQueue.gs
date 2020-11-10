package gw.surepath.ab.cvmt.expimp.workorchestration

uses gw.expimp.workorchestration.GeneralMigrationWorkQueue


public class ContactMigrationWorkQueue extends GeneralMigrationWorkQueue  {

    public construct() {
        super(BatchProcessType.TC_CONTACTMIGRATIONTOOL_SP)
    }

}

