#Under the hood
> [**Home**](../README.md) ▸ [**Reference**](../docs/README.md) ▸ **Under the Hood**

## [CS Resource Service](../src/cs-resource-service)
<a href="../src/cs-resource-service"><img src="images/go_to_source.png" align="right"></a>

## [CS Data Store](../src/cs-data-store)
<a href="../src/cs-data-store"><img src="images/go_to_source.png" align="right"></a>

## [CS REST API](../src/cs-rest-api)
<a href="../src/cs-rest-api"><img src="images/go_to_source.png" align="right"></a>

## [CS Settings Provider](../src/cs-settings-provider)
<a href="../src/cs-settings-provider"><img src="images/go_to_source.png" align="right"></a>

Provides global settings for all CS Components within your app.
Call `set(option, value)` on the provider to set an app-wide default parameter.

Available options:
* `date-format`
* `time-zone-offset`
* `i18n-engine`

## [CS Localozation Provider](../src/cs-localization-provider)
<a href="../src/cs-localization-provider"><img src="images/go_to_source.png" align="right"></a>

The default i18n engine of CloudStorm.
Call `set(option, value)` on the provider to set an app-wide default parameter.
You can swap it with your chosen internationalisation engine as long as it provides a `t(key)` function, which returns the matching `value` for `key`.

## [CS Template Service](../src/cs-template-service)
<a href="../src/cs-template-service"><img src="images/go_to_source.png" align="right"></a>
