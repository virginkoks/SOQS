<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
	
	define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR$f00kmFE1_CC');
				
	require_once CDIR . '/equipment/functions.php';
			
	$DB = new DBWORKER('localhost', 'ank', 'utf8', 'ank_management', 'epNmbwE46q8Bqb8h');

	switch ($_POST['action']) {
		
		case 1:
		
			if (isset($_POST['auth_name']) && isset($_POST['auth_pass'])) {

				$user_id = $DB -> prep('SELECT `id` FROM `0_users` WHERE `hash` = "' . sha1(md5($_POST['auth_name'] . $_POST['auth_pass']) . '_ER6ymSG8ncsYfGQd') . '"') -> fetch(PDO :: FETCH_NUM);
				
				if ($user_id && (int)$user_id[0] === 0) {
					
					ini_set('session.cookie_lifetime', 3600);
				  
					session_start();
					
					$_SESSION['id'] = $user_id[0];
					
					$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
					
				}
			  
			}
		
		break; // login
		
		case 2:
		
			session_start();
			
			session_destroy();
		
		break; // logout
		
		case 3: 
		
			$udata = json_decode(file_get_contents('N7t4eNf5YsmM5hK5/3tHMBwdNGhuuwQCq'), true);
			
			unset($udata[$_POST['id']]);
			
			$fstream = fopen('N7t4eNf5YsmM5hK5/3tHMBwdNGhuuwQCq', "wb");
			
			fwrite($fstream, json_encode($udata));
			
			fclose($fstream);
		
			$DB -> prep('DELETE FROM `0_users` WHERE `id` = ' . $_POST['id']);
		
		break; // userdel
		
		case 4:
		
			$empty_id = $DB -> prep('SELECT (`0_users`.`id` + 1) FROM `0_users` WHERE (SELECT 1 FROM `0_users` AS `t` WHERE `t`.`id` = (`0_users`.`id` + 1)) IS NULL ' .
			
				'ORDER BY `0_users`.`id` LIMIT 1') -> fetch(PDO :: FETCH_NUM);
			
			$udata = json_decode(file_get_contents('N7t4eNf5YsmM5hK5/3tHMBwdNGhuuwQCq'), true);
			
			$udata = $udata + array($empty_id[0] => array($_POST['login'], $_POST['password']));
			
			$fstream = fopen('N7t4eNf5YsmM5hK5/3tHMBwdNGhuuwQCq', "wb");
			
			fwrite($fstream, json_encode($udata));
			
			fclose($fstream);
			
			$data = array('id' => $empty_id[0], 'hash' => sha1(md5($_POST['login'] . $_POST['password']) . SECRET), 'name' => $_POST['name'], 'project' => $_POST['project'], 
			
				'data' => $_POST['data']);
		
			$DB -> prep('INSERT INTO `0_users` (`id`, `hash`, `name`, `project`, `data`) VALUES (:id, :hash, :name, :project, :data)', $data);
		
		break; // useradd
		
		case 5:
		
			if (is_array($_POST['field'])) {
				
				$h = ($_POST['field'][0] == 'login') ? sha1(md5($_POST['text'] . $_POST['field'][1]) . '_' . SECRET) : sha1(md5($_POST['field'][1] . $_POST['text']) . '_' . SECRET);
				
				$result = $DB -> prep('UPDATE `' . $_POST['table'] . '` SET `hash` = "' . $h . '" WHERE `id` = ?', $_POST['id']);
				
			} else $result = $DB -> prep('UPDATE `' . $_POST['table'] . '` SET `' . $_POST['field'] . '` = ? WHERE `id` = ?', array($_POST['text'], $_POST['id']));
		
			echo $result ? 1 : 0;
			
			exit;
		
		break; // userupdate
		
	}
	
	header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
			
	exit;

}

if (isset($_REQUEST[session_name()])) session_start();

if (! isset($_SESSION['id']) || (int)$_SESSION['id'] != 0 || $_SESSION['ip'] != $_SERVER['REMOTE_ADDR']) { 

	echo '

<form method="post">

<input type="text" name="auth_name" autofocus><br>

<input type="password" name="auth_pass"><br>

<input type="hidden" name="action" value="1">

<input type="submit">

</form>';

	exit;

}

define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR$f00kmFE1_CC');
			
require_once CDIR . '/equipment/functions.php';
		
$DB = new DBWORKER('localhost', 'ank', 'utf8', 'ank_management', 'epNmbwE46q8Bqb8h');

$users_data = $DB -> prep('SELECT `id`, `name`, `project`, `data`, `login_time`, `ip` FROM `0_users` WHERE `id` != 0 ORDER BY `id`') -> fetchAll(PDO :: FETCH_ASSOC);

$projects_data = $DB -> prep('SELECT * FROM `0_projects` ORDER BY `id`') -> fetchAll(PDO :: FETCH_ASSOC);

$udata = json_decode(file_get_contents('N7t4eNf5YsmM5hK5/3tHMBwdNGhuuwQCq'), true);

$htm_users = 

'<table id="users" class="table-content">' .

'<tr><td class="td-caption">id</td><td class="td-caption">name</td><td class="td-caption">login</td><td class="td-caption">password</td><td class="td-caption">last activity</td>' .

'<td class="td-caption">ip</td><td class="td-caption">project</td><td class="td-caption">data</td><td id="useradd" class="td-caption-special">+</td></tr>';

foreach ($users_data as $val) $htm_users .= 

'<tr><td class="td-inside">' . $val['id'] . '</td><td id="edit_name_' . $val['id'] . '" class="td-inside td-edit">' . $val['name'] . 
	
'</td><td id="edit_login_' . $val['id'] . '" class="td-inside td-edit">' . $udata[$val['id']][0] . '</td><td id="edit_password_' . $val['id'] . '" class="td-inside td-edit">' . 

htmlspecialchars($udata[$val['id']][1], ENT_QUOTES, 'utf-8') . '</td><td class="td-inside">' . ($val['login_time'] ? date('jS M y H:i:s', $val['login_time']) : 'not registered') . 

'</td><td class="td-inside">' . ($val['ip'] ? long2ip($val['ip']) : 'not registered') . '</td><td id="edit_project_' . $val['id'] . '" class="td-inside td-edit">' . $val['project'] . 

'</td><td id="edit_data_' . $val['id'] . '" class="td-inside td-edit">' . $val['data'] . '</td><td id="userdel_' . $val['id'] . '" class="td-caption-special">-</td></tr>';

$htm_users .= '</table>';

$htm_projects = 

'<table id="projects" class="table-content display-none">' .

'<tr><td class="td-caption">id</td><td class="td-caption">name</td><td class="td-caption">content</td><td class="td-caption">start time</td><td class="td-caption">finish time</td>' .

'<td id="projectadd" class="td-caption-special">+</td></tr>';

foreach ($projects_data as $val) $htm_projects .= 

'<tr><td class="td-inside">' . $val['id'] . '</td><td id="edit_name_' . $val['id'] . '" class="td-inside td-edit">' . $val['name'] . 
	
'</td><td id="edit_content_' . $val['id'] . '" class="td-inside td-edit">' . $val['content'] . '</td><td class="td-inside">' . 

($val['start_time'] ? date('jS M y H:i:s', $val['start_time']) : 'not registered') . '</td><td class="td-inside">' . 

($val['finish_time'] ? date('jS M y H:i:s', $val['finish_time']) : 'not registered') . '</td><td id="projectdel_' . $val['id'] . '" class="td-caption-special">-</td></tr>';

$htm_projects .= '</table>';

$htm_outdata =

'<table id="outdata" class="table-content display-none">' .

'<tr><td><select id="odproject"><option>select project</option>';

foreach ($projects_data as $val) $htm_outdata .= '<option id="' . $val['id'] . '">' . $val['name'] . '</option>';

$htm_outdata .= '</select></td></tr><tr><td></td></tr></table>';

?>

<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<title>ank management</title>
<link rel="stylesheet" href="N7t4eNf5YsmM5hK5/style.css"/>
<link rel="stylesheet" href="../public/css/2.css"/>
<script src="../public/js/0.js"></script>
<script src="N7t4eNf5YsmM5hK5/script.js"></script>
</head>
<body>

<table class="menu-top"><tr>
<td align="right"></td>
</tr></table>

<table id="main" class="table-main">
<tr>
	<td id="menuusers" class="menu menu-active">users</td>
    <td id="menuprojects" class="menu menu-inactive">projects</td>
    <td id="menuoutdata" class="menu menu-inactive">out data</td>
    <td id="menulogout" class="menu menu-inactive">logout</td>
    <td class="menu-cap"></td>
</tr>
<tr>
	<td id="content" class="td-content" colspan="5"><?=$htm_users . $htm_projects . $htm_outdata?></td>
</tr>
</table>

</body>
</html>

