<?PHP
/* Copyright 2005-2021, Lime Technology
 * Copyright 2012-2021, Bergware International.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */
?>
<?
$docroot = $docroot ?? $_SERVER['DOCUMENT_ROOT'] ?: '/usr/local/emhttp';
require_once "$docroot/webGui/include/Secure.php";
require_once "$docroot/webGui/include/Helpers.php";

// Get the webGui configuration preferences
extract(parse_plugin_cfg('dynamix',true));

// set tty window font size
exec("sed -ri 's/fontSize=[0-9]+/fontSize=${display['tty']}/' /etc/default/ttyd");

function command($path,$file) {
  return (file_exists($file) && substr($file,0,strlen($path))==$path) ? "tail -f -n 60 '$file'" : "bash --login --restricted";
}
switch ($_GET['tag']) {
case 'ttyd':
  // check if ttyd already running
  exec("pgrep -f '/var/run/ttyd.sock'", $ttyd_pid, $retval);
  if ($retval == 0) {
      // check if there are any child processes, ie, curently open tty windows
      exec("pgrep -P ${ttyd_pid[0]}", $output, $retval);
      if ($retval != 0) {
        // no child processes, restart ttyd to pick up possible font size change
        exec("kill ${ttyd_pid[0]}");
      }
  }
  if ($retval != 0)
    exec("ttyd-exec -i '/var/run/ttyd.sock' bash --login");
  break;
case 'syslog':
  $path = '/var/log/';
  $file = realpath($path.$_GET['name']);
  exec("ttyd-exec -o -i '/var/run/syslog.sock' ".command($path,$file));
  @unlink('/var/run/syslog.sock');
  break;
case 'log':
  $path = '/var/log/';
  $name = unbundle($_GET['name']);
  $file = realpath($path.$_GET['more']);
  exec("ttyd-exec -o -i '/var/tmp/$name.sock' ".command($path,$file));
  @unlink('/var/tmp/$name.sock');
  break;
case 'docker':
  $name = unbundle($_GET['name']);
  $more = unbundle($_GET['more']) ?: 'sh';
  $docker = '/var/tmp/docker.log';
  if ($more=='.log') {
    $sock = "/var/tmp/$name.log.sock";
    file_put_contents($docker,"#!/bin/bash\ndocker logs -f -n 60 '$name'\nbash --login\n");
    chmod($docker,0755);
    exec("ttyd-exec -o -i '$sock' $docker");
  } else {
    $sock = "/var/tmp/$name.sock";
    exec("ttyd-exec -o -i '$sock' docker exec -it '$name' $more");
  }
  @unlink($sock);
  break;
}
?>
