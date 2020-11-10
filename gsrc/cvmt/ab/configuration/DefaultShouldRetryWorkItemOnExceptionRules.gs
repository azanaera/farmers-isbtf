package cvmt.ab.configuration;

uses com.guidewire.pl.system.exception.*;
uses gw.expimp.workorchestration.*;

@SuppressWarnings("HiddenPackageReference")
class DefaultShouldRetryWorkItemOnExceptionRules implements ShouldRetryWorkItemOnException
{
    @Override
    public override function  check( exception: Exception): boolean
    {
        return exception typeis ConcurrentDataChangeException;
    }
}