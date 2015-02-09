<?php 

if ($_SERVER['REQUEST_METHOD'] == 'GET' || ! isset($_POST['a']) || ! is_numeric($_POST['a']) || $_POST['a'] > 4 || ! isset($_POST['b']) || strlen($_POST['b']) != 32) die();

define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR$f00kmFE1_CC');

define ('SESSTIME', 60); // min

$upload = array('amount' => 2, 'type' => array('image/jpeg', 'image/png', 'image/gif'), 'size' => 2097152);

require_once CDIR . '/equipment/functions.php';

$DB = new DBWORKER('localhost', 'ank', 'utf8', 'ank_user', '6ADMxWJZQRaDaUPA');

switch ($_POST['a']) {
	 
//	case 2:
//		
//		$login_data = $DB -> prep('SELECT `id`, `project`, `login_time`, `ip`, `unique` FROM `0_users` WHERE `hash` = "' . sha1($_POST['b'] . '_' . SECRET) . '"') 
//		
//			-> fetch(PDO :: FETCH_ASSOC);
//		
//		if (! $login_data['unique'] || ((int)$login_data['ip'] === ip2long($user_ip) && (time() - $login_data['login_time']) < SESSTIME * 60)) {
//		
//			$temphash = time();
//			
//			$DB -> prep('INSERT INTO `0_temp` () VALUES (' . $login_data['id'] . ', ' . $login_data['project'] . ', ' . $login_data['unique'] . ', "' . md5($temphash) . '", ' . $temphash . ')');
//			
//			echo md5($temphash);
//		
//		} else customErrorHandler($user_ip . "\tUser ip does not match or login time expires\n\nlogin ip\t" . long2ip($login_data['ip']) .
//		
//			 "\n\nlogin_time\t" . $login_data['login_time'] . "\ntime\t\t" . time() . "\ndifference\t" . (time() - $login_data['login_time']) . "\nsesstime\t" . (SESSTIME * 60));
//	 
//	break; // post request #1
//	 
//	case 3:
//	 
//		if (isset($_POST['c'])) {
//	 
//			$post_userdata = $DB -> prep('SELECT * FROM `0_temp` WHERE `hash` = ?', $_POST['b']) -> fetch(PDO :: FETCH_ASSOC);
//			
//			if ($post_userdata) {
//				
//				$DB -> prep('DELETE FROM `0_temp` WHERE `hash` = ?', $_POST['b']);
//				
//				$post_FL = false;
//				
//				if ((time() - $post_userdata['hash_time']) < 10) {
//					
//					include (CDIR . '/projects/' . $post_userdata['project'] . '/php/out.php');
//					
//				} else customErrorHandler($user_ip . "\thash_time expires\n\ntime\t\t" . time() . "\nhash_time\t" . $post_userdata['hash_time'] . 
//				
//					"\ndifference\t" . (time() - $post_userdata['hash_time']) . "\nsesstime\t10");
//				
//				if ($post_FL !== false && $post_userdata['unique']) $DB -> prep('UPDATE `0_users` SET `login_time` = NOW() WHERE `id` = ' . $post_userdata['uid']);
//					
//				echo (is_bool($post_FL)) ? $post_FL : json_encode($post_FL);
//				
//			} else customErrorHandler($user_ip . "\tPost error #1");
//		
//		} else customErrorHandler($user_ip . "\tPost error #2");
//	 
//	break; // post request #2
	
	case 4:
	
		$login_data = $DB -> prep('SELECT `login_time`, `ip` FROM `0_users` WHERE `hash` = "' . sha1($_POST['b']) . '_' . SECRET . '"') 
		
			-> fetch(PDO :: FETCH_ASSOC);
			
		if (isset($_FILES) && count($_FILES) && (int)$login_data['ip'] === ip2long($user_ip) && (time() - $login_data['login_time']) < SESSTIME * 60) {
			
			$upload_ok = true;
			
			if (count($_FILES) == $upload['amount']) {
				
				foreach ($_FILES as $val) {
					
					if (! in_array($val['type'], $upload['type'])) $upload_ok = customErrorHandler($user_ip . "\tUpload type error (thumbnail)\n\n" . $val['type']);
					
					if ($val['size'] > $upload['size']) $upload_ok = customErrorHandler($user_ip . "\tUpload size error (thumbnail)\n\n" . $val['size']);
					
					if (! $upload_ok) break;
					
				}
				
			} else $upload_ok = customErrorHandler($user_ip . "\tUpload amount error (thumbnail)\n\n" . count($_FILES));
			
			if ($upload_ok) {
			
				$return = array();
		
				for ($i = 0; $i < count($_FILES); $i ++) {
	
					$img_src = imagecreatefromjpeg($_FILES['file_' . $i]['tmp_name']);
					
					$img_size = getimagesize($_FILES['file_' . $i]['tmp_name']);
					
					$delta_width = $img_size[0] / 70;
					
					$delta_height = $img_size[1] / 70;
					
					$mini_img_width = ($delta_width > $delta_height) ? $img_size[0] / $delta_width : $img_size[0] / $delta_height;
					
					$mini_img_height = ($delta_width > $delta_height) ? $img_size[1] / $delta_width : $img_size[1] / $delta_height;
					
					$mini_img = imagecreatetruecolor($mini_img_width, $mini_img_height);
					
					$mini_img_name = md5(mt_rand());
					
					imagecopyresampled($mini_img, $img_src, 0, 0, 0, 0, $mini_img_width, $mini_img_height, $img_size[0], $img_size[1]);
					
					imagejpeg($mini_img, $_SERVER['DOCUMENT_ROOT'] . '/ank/public/temp/' . $mini_img_name . '.jpg');
					
					imagedestroy($mini_img);
					
					$return = $return + array($i + 1 => $mini_img_name);
			
				}
				
				echo json_encode($return);
				
			}
			
		} else customErrorHandler($user_ip . "\tUser ip does not match or login time expires\n\nlogin ip\t" . long2ip($login_data['ip']) .
		
			 "\n\nlogin_time\t" . $login_data['login_time'] . "\ntime\t\t" . time() . "\ndifference\t" . (time() - $login_data['login_time']) . "\nsesstime\t" . (SESSTIME * 60));
	
	break; // upload
	
//	case 5:
//		
//		$quest_data = $DB -> prep('SELECT `data_id` FROM `0_quest` WHERE `hash` = "' . sha1($_POST['b'] . '_' . SECRET) . '" LIMIT 1') -> fetch(PDO :: FETCH_ASSOC);
//		
//		if ($quest && $user_data['projects']) {
//			
//			if ($user_data['unique']) $DB -> prep('UPDATE `0_users` SET `ip` = ' . ip2long($user_ip) . ' WHERE `id` = ' . $user_data['id']);
//			
//			$projects = explode(",", $user_data['projects']);
//			
//			$htm = file_get_contents(CDIR . '/projects/' . $projects[0] . '/htm/ank.htm');
//			
//			$js = file_get_contents(CDIR . '/projects/' . $projects[0] . '/js/script.js');
//			
//			$css = file_get_contents(CDIR . '/projects/' . $projects[0] . '/css/style.css');
//			
//			include (CDIR . '/projects/' . $projects[0] . '/php/in.php');
//			
//			$return = array('htm' => $htm, 'js' => $js, 'css' => $css, 'data' => $data, 'amount' => $amount[0]);
//			
//			echo json_encode($return);
//			
//		}
//		 
//	break; // login
		 
}

$DB -> close();

?>