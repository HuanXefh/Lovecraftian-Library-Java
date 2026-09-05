@echo off

@rem Version of game to launch.
set LAUNCHER=H:\Dropbox\_gm_mdt\Mindustry\Mindustry-BE-Desktop-27754.jar

@rem Project root path.
set LOCAL=H:\Dropbox\_gm_mdt\lovec
@rem Project path of Lovec (.jar built).
set LOCAL1=%LOCAL%\mabo-lovecraftian-library\build\libs\mabo-lovecraftian-libraryDesktop.jar
@rem Project path of LovecLab.
set LOCAL2=%LOCAL%\mabo-lovecraftian-laboratory
@rem Project path of ProjReind.
set LOCAL3=%LOCAL%\mabo-project-reindustrialization
@rem Project path of Serp2.
set LOCAL4=%LOCAL%\mabo-serpulo-squared
@rem Project path of FCell.
set LOCAL5=%LOCAL%\mabo-fluid-cells

@rem Target root path.
set TARGET=C:\Users\lenovo\AppData\Roaming\Mindustry\mods
@rem Target path of Lovec.
set TARGET1=%TARGET%\mabo-lovecraftian-libraryDesktop.jar
@rem Target path of LovecLab.
set TARGET2=%TARGET%\mabo-lovecraftian-laboratory
@rem Target path of ProjReind.
set TARGET3=%TARGET%\mabo-project-reindustrialization
@rem Target path of Serp2.
set TARGET4=%TARGET%\mabo-serpulo-squared
@rem Target path of FCell.
set TARGET5=%TARGET%\mabo-fluid-cells

echo.
echo Select deploy mode:
echo L - Launch game directly.
echo B - Build the lib only.
echo C - Copy files only (Slower).
echo A - Do everything (Slowest).
choice /c LBCA
echo.
if errorlevel 4 goto :All
if errorlevel 3 goto :Copy
if errorlevel 2 goto :Build
if errorlevel 1 goto :Launch

:Build
python bundleGen.py
echo Updated bundle files
call gradlew jar
echo.
xcopy %LOCAL1% %TARGET1%* /Y /s /e /i /q
goto :Launch

:All
python bundleGen.py
echo Updated bundle files
call gradlew jar
echo.

:Copy
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
