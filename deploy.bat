@echo off

@rem Version of game to launch.
set launcher=H:\Dropbox\_gm_mdt\Mindustry\Mindustry-BE-Desktop-26996.jar
@rem Project path of Lovec (.jar built).
set LOCAL1=H:\Dropbox\_gm_mdt\lovec\mabo-lovecraftian-library\build\libs\mabo-lovecraftian-libraryDesktop.jar
@rem Project path of LovecLab.
set LOCAL2=H:\Dropbox\_gm_mdt\lovec\mabo-lovecraftian-laboratory
@rem Project path of ProjReind.
set LOCAL3=H:\Dropbox\_gm_mdt\lovec\mabo-project-reindustrialization
@rem Target path of Lovec.
set TARGET1=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-lovecraftian-libraryDesktop.jar
@rem Target path of LovecLab.
set TARGET2=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-lovecraftian-laboratory
@rem Target path of ProjReind.
set TARGET3=C:\Users\lenovo\AppData\Roaming\Mindustry\mods\mabo-project-reindustrialization

echo Skip updating mod files?
choice /c YN
if errorlevel 2 goto :Build
if errorlevel 1 goto :Launch

:Build
call gradlew jar
rd %TARGET2% /s /q
rd %TARGET3% /s /q
xcopy %LOCAL1% %TARGET1%* /Y /s /e /i /q
xcopy %LOCAL2% %TARGET2% /s /e /i /q
xcopy %LOCAL3% %TARGET3% /s /e /i /q

:Launch
%launcher%
