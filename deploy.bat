@echo off

@rem Version of game to launch.
set LAUNCHER=H:\Dropbox\_gm_mdt\Mindustry\Mindustry-BE-Desktop-27374.jar
@rem Project path of Lovec (.jar built).
set LOCAL1=H:\Dropbox\_gm_mdt\lovec\mabo-lovecraftian-library\build\libs\mabo-lovecraftian-libraryDesktop.jar
@rem Project path of LovecLab.
set LOCAL2=H:\Dropbox\_gm_mdt\lovec\mabo-lovecraftian-laboratory
@rem Project path of ProjReind.
set LOCAL3=H:\Dropbox\_gm_mdt\lovec\mabo-project-reindustrialization
@rem Project path of Serp2.
set LOCAL4=H:\Dropbox\_gm_mdt\lovec\mabo-serpulo-squared
@rem Project path of FCell.
set LOCAL5=H:\Dropbox\_gm_mdt\lovec\mabo-fluid-cells
@rem Target path of Lovec.
set TARGET1=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-lovecraftian-libraryDesktop.jar
@rem Target path of LovecLab.
set TARGET2=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-lovecraftian-laboratory
@rem Target path of ProjReind.
set TARGET3=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-project-reindustrialization
@rem Target path of Serp2.
set TARGET4=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-serpulo-squared
@rem Target path of FCell.
set TARGET5=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-fluid-cells

echo.
echo Skip updating mod files?
choice /c YN
echo.
if errorlevel 2 goto :Build
if errorlevel 1 goto :Launch

:Build
python bundleGen.py
echo Updated bundle files
call gradlew jar
echo.
rd %TARGET2% /s /q
rd %TARGET3% /s /q
rd %TARGET4% /s /q
rd %TARGET5% /s /q
xcopy %LOCAL1% %TARGET1%* /Y /s /e /i /q
xcopy %LOCAL2% %TARGET2% /s /e /i /q
xcopy %LOCAL3% %TARGET3% /s /e /i /q
xcopy %LOCAL4% %TARGET4% /s /e /i /q
xcopy %LOCAL5% %TARGET5% /s /e /i /q
echo.

:Launch
echo Launching Mindustry...
echo.
%LAUNCHER%
