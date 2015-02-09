<?php

class AWORKWER {
	
	private $Q, $W = array();
	
	function __construct() {}
	
	public function workArrayBuilder($item, $key) {
		
		if (array_key_exists($item['q_id'], $this -> W)) {
			
			array_push($this -> W[$item['q_id']]['a'], $item);
			
		} else {
			
			foreach ($this -> Q as $val) if ($val['id'] == $item['q_id']) $this -> W[$item['q_id']]['q'] = $val;
			
			$this -> W[$item['q_id']]['a'] = array($item);
			
		}
	
	}
	
	public function post() {
		
		global $DB;
		
		$post_data = json_decode($_POST['post_data'], true);

		if (count($_SESSION['in_block']) == count(array_map('is_numeric', array_keys($post_data)))) { 
	
			require (CDIR . '/projects/' . $_SESSION['project'] . '/php/out_verify.php');
			
			if ($out_verify_flag) {
		
				if (count($_FILES)) {
					
					$get_block = $DB -> prep('SELECT `block_' . $_SESSION['w_amount'] . '` FROM `' . $_SESSION['project'] . '_temp_out` WHERE `uid` = ' . $_SESSION['id'] . ' LIMIT 1') -> fetch(PDO :: FETCH_NUM);
					
					$block_fdata = $get_block[0] ? json_decode($get_block[0], true) : false;
					
					$file_upload_expr = json_decode($_SESSION['file_upload'], true);
					
					foreach ($_FILES as $files_key => $files_val) {
						
						if (array_sum($files_val['error']) == 0) { // upload file
	
							foreach ($files_val['tmp_name'] as $fkey => $tmp_name) {
							
								if ($files_val['type'][$fkey] == $file_upload_expr[$files_key]['type'][$fkey] && $files_val['size'][$fkey] <= $file_upload_expr[$files_key]['size'][$fkey]) {
									
									if (! file_exists(CDIR . '/projects/' . $_SESSION['project'] . '/upload/w' . $_SESSION['wave_current'] . '/' . $_SESSION['id'])) mkdir(CDIR . '/projects/' . $_SESSION['project'] . '/upload/w' . $_SESSION['wave_current'] . '/' . $_SESSION['id']);
									
									$path_info = pathinfo($files_val['name'][$fkey]);
									
									$fname = $block_fdata ? substr($block_fdata[substr($files_key, 5)][$fkey + 1], 0, strpos($block_fdata[substr($files_key, 5)][$fkey + 1], '/')) : md5(mt_rand()) . ' '. date('jS-M-y H-i-s') . '.' . $path_info['extension'];
									
									$upload_src = CDIR . '/projects/' . $_SESSION['project'] . '/upload/w' . $_SESSION['wave_current'] . '/' . $_SESSION['id'] . '/' . $fname;
									
									if (! copy($tmp_name, $upload_src)) $upload_error = true;
									
									$post_data[substr($files_key, 5)][$fkey + 1] = $fname . '/' . $files_val['name'][$fkey];
									
								} else $upload_error = true;
								
								if (isset($upload_error)) break 2;
								
							}
							
						} else { // no upload file
							
							if ($block_fdata) {
								
								foreach ($block_fdata[substr($files_key, 5)] as $exkey => $existing) if (! file_exists(CDIR . '/projects/' . $_SESSION['project'] . '/upload/w' . $_SESSION['wave_current'] . '/' . $_SESSION['id'] . '/' . substr($existing, 0, strpos($existing, '/')))) {
									
									$upload_error = true;
									
									break;
								
								} else $post_data[substr($files_key, 5)][$exkey] = $existing;
								
							} else $upload_error = true;
							
							if (isset($upload_error)) break;
							
						}
						
					}
					
					$block_data = $post_data;
	
				} else $block_data = $post_data;
				
				return isset($upload_error) ? false : $block_data;

			}
			
		}
		
	}
	
	public function finalize() {
		
		global $DB;
		
		for ($i = 1, $qstr = '`block_'; $i <= $_SESSION['b_amount']; $i ++) $qstr .= ($i . ($i < $_SESSION['b_amount'] ? '`, `block_' : '`'));

		$ftemp = $DB -> prep('SELECT ' . $qstr . ' FROM `' . $_SESSION['project'] . '_temp_out` WHERE `uid` = ' . $_SESSION['id'] . ' LIMIT 1') -> fetch(PDO :: FETCH_ASSOC);
	
		$post_data = array();
	
		foreach ($ftemp as $fval) $post_data = $post_data + json_decode($fval, true);
	
		foreach ($post_data as $qn => $aa) if (count($aa)) $queryarr['a' . $qn] = implode('|', $aa);
		
		return 
		
		$DB -> prep('INSERT INTO `' . $_SESSION['project'] . '_out` (`uid`, `ip`, `wave`, `q' . implode('`, `q', array_keys($post_data)) . '`) VALUES (' . $_SESSION['id'] . ', INET_ATON("' . $_SERVER['REMOTE_ADDR'] . '"), ' . $_SESSION['wave_current'] . ', :a' . implode(', :a', array_keys($post_data)) . ')', $queryarr) &&
	
		$DB -> prep('DELETE FROM `' . $_SESSION['project'] . '_temp_out` WHERE `uid` = ' . $_SESSION['id']) ? $_SESSION['iw_count'] + 1 : false;
		
		//include (CDIR . '/projects/' . $_SESSION['project'] . '/php/stat.php');

	}
	
	public function logout() {
		
		session_unset();
			
		session_destroy();
			
		header('Location: http://' . $_SERVER['HTTP_HOST'] . '/ank/');
			
		exit;
		
	}
	
	public function build($a) {
		
		global $DB;
		
		switch ($a) {
			
			case 'a':
		
				$B = $DB -> prep ('SELECT * FROM `' . $_SESSION['project'] . '_b` WHERE `id` = ' . $_SESSION['w_amount'] . ' LIMIT 1') -> fetch(PDO :: FETCH_ASSOC);
					
				$_SESSION['in_block'] = explode(',', $B['in_block']);
			
				$this -> Q = $DB -> prep('SELECT * FROM `' . $_SESSION['project'] . '_q` WHERE `b_id` = ' . $_SESSION['w_amount'] . ' LIMIT ' . count($_SESSION['in_block'])) -> fetchAll(PDO :: FETCH_ASSOC);
				
				$A = $DB -> prep('SELECT * FROM `' . $_SESSION['project'] . '_a` WHERE `q_id` = ' . implode(' OR `q_id` = ', $_SESSION['in_block']) . ' ORDER BY `a_id`') -> fetchAll(PDO :: FETCH_ASSOC);
				
				array_walk($A, array(&$this, 'workArrayBuilder'));
					
				$temp_data = $DB -> prep('SELECT * FROM `' . $_SESSION['project'] . '_temp_out` WHERE `uid` = ' . $_SESSION['id'] . ' LIMIT 1') -> fetch(PDO :: FETCH_ASSOC);
				
				if ($temp_data && $temp_data['block_' . $_SESSION['w_amount']]) $temp_block = json_decode($temp_data['block_' . $_SESSION['w_amount']], true);
			
				// progress building --------
					
			//		if ($_SESSION['q_amount'] > 1) for ($i = 1, $pstruct = '<table class="progress"><tr>'; $i <= $_SESSION['q_amount']; $i ++) 
			//					
			//			$pstruct .= ($i < $_SESSION['q_amount']) ? '<td id="p' . $i . '" class="pr-point ' . (($i <= $_SESSION['w_amount']) ? 'pr-point-active' : '') . '"></td><td class="pr-dist ' . (($_SESSION['w_amount'] - $i > 0) ? 'pr-dist-active' : '') . '"></td>' : 
			//			
			//			'<td id="p' . $i . '" class="pr-point"></td></tr></table>';
						
				// answer building ----------
					
				$j = 0;
				
				$block_structure = unserialize($B['structure']);
				
				$astruct = '
				
	<table class="staff-container">
		
		<tr>
		
			<td class="block-title">' . $B['title'] . '</td>
		
		</tr>
		
		<tr>
		
			<td class="block-description">' . $B['description'] . '</td>
		
		</tr>
		
		<tr>
		
			<td>
				
				<table class="answer-structure">';
				
				foreach ($block_structure as $tr) { 
				
					$astruct .= '<tr><td style="vertical-align:top">' . ((count($tr) > 1) ? '<table style="width: 100%;"><tr>' : '');		
				
					foreach ($tr as $td) {
						
						$answer_body = array(
						
							'<div id="answer_container_' . $this -> W[$td]['q']['id'] . '" class="answer-container">',
						
							'<div class="question-item">' . $this -> W[$td]['q']['title'] . '</div>',
							
							'<div class="question-comment">' . $this -> W[$td]['q']['comment'] . '</div>'
							
						);
			
						switch ($this -> W[$td]['q']['control_type']) {
							
							case 0:
							
							
							
							break; // divider
							
							case 1: case 2:
							
								foreach ($this -> W[$td]['a'] as $options) {
									
									if (isset($temp_block) && in_array($this -> W[$td]['q']['id'], $_SESSION['in_block'])) { // back data hit -------------
																																				//
										$recmatch = array();																					//
																																				//
										foreach ($temp_block[$this -> W[$td]['q']['id']] as $key => $rec)												//
																																				//	
										if ($options['a_id'] == $key) {																			//
																																				//
											preg_match('/^' . $options['a_id'] . '[a-z]+\[(.+)\]|' . $options['a_id'] . '$/', $rec, $recmatch);	//
																																				//
											if (count($recmatch)) break;																		//
																																				//
										} 																										//
																																				//
									} //----------------------------------------------------------------------------------------------------------
							
									array_push($answer_body,
							
										'<div class="answer-item">',
									
										'<input id="' . $options['q_id'] . '_' . $options['a_id'] . '" type="' . ($this -> W[$td]['q']['control_type'] == 1 ? 'radio' : 'checkbox') . '" name="' . $options['q_id'] . '"' . (isset($recmatch) && count($recmatch) ? ' checked="checked"' : '') . '>',
									
										'<label for="' . $options['q_id'] . '_' . $options['a_id'] . '" class="' . ($this -> W[$td]['q']['control_type'] == 1 ? 'radio' : 'checkbox') . '">' . $options['options'] . '</label>' . ($this -> W[$td]['q']['comment'] ? '<span class="a-label-comment">' . $this -> W[$td]['q']['comment'] . '</span>' : ''),
										
										$options['text_type'] ? '<input id="' . $options['q_id'] . '_' . $options['a_id'] . '" type="' . $options['text_type'] . '" class="text-inactive' . (isset($recmatch) && count($recmatch) ? ' text-active' : '') . '"' . (isset($recmatch) && count($recmatch) ? ' value="' . htmlspecialchars($recmatch[1], ENT_QUOTES) . '"' : '') . '>' : '',
										
										'</div>'
										
									);
								
								}
							
							break; // radio, checkbox
							
							case 3:
			
								array_push($answer_body, 
								
									'<div class="answer-item">', 
									
									'<select id="' . $this -> W[$td]['q']['id'] . '_' . $this -> W[$td]['a'][0]['a_id'] . '" ' . $this -> W[$td]['q']['control_set'] . '>'
									
								);
							
								foreach ($this -> W[$td]['a'] as $options) {
									
									if (isset($temp_block) && in_array($this -> W[$td]['q']['id'], $_SESSION['in_block'])) { // back data hit -------------
																																				//
										$recmatch = array();																					//
																																				//
										foreach ($temp_block[$this -> W[$td]['q']['id']] as $key => $rec)												//
																																				//	
										if ($options['a_id'] == $key) {																			//
																																				//
											preg_match('/^' . $options['a_id'] . '[a-z]+\[(.+)\]|' . $options['a_id'] . '$/', $rec, $recmatch);	//
																																				//
											if (count($recmatch)) break;																		//
																																				//
										} 																										//
																																				//
									} //----------------------------------------------------------------------------------------------------------	
									
									$seltext = $options['text_type'] ? $options['text_type'] : false;
									
									array_push($answer_body, '<option' . ($seltext ? ' data-text' : '') . (isset($recmatch) && count($recmatch) ? ' selected="selected"' : '') . '>' . $options['options'] . '</option>');
									
								}
								
								array_push($answer_body, 
								
									'</select>', 
									
									$seltext ? '<input id="' . $this -> W[$td]['q']['id'] . '_' . $options['a_id'] . '" type="' . $seltext . '" class="text-inactive' . (isset($recmatch) && count($recmatch) ? ' text-active' : '') . '"' . (isset($recmatch) && count($recmatch) ? ' value="' . htmlspecialchars($recmatch[1], ENT_QUOTES) . '"' : '') . '>' : '',
									
									'</div>'
									
								);
							
							break; // select
							
							case 4:
							
								if (isset($temp_block) && in_array($this -> W[$td]['q']['id'], $_SESSION['in_block'])) preg_match('/\[(.+)\]/', $temp_block[$this -> W[$td]['q']['id']][$this -> W[$td]['a'][0]['a_id']], $recmatch); // back data hit
							
								array_push($answer_body,
							
									'<div class="answer-item">',
			
									'<input id="' . $this -> W[$td]['q']['id'] . '_' . $this -> W[$td]['a'][0]['a_id'] . '" type="' . $this -> W[$td]['a'][0]['text_type'] . '" class="" ' . (isset($recmatch) ? 'value="' . htmlspecialchars($recmatch[1], ENT_QUOTES) . '"' : '') . ($this -> W[$td]['a'][0]['input_set'] ? $this -> W[$td]['a'][0]['input_set'] : '') . '>',
									
									'</div>'
									
								);
							
							break; // text
							
							case 5:
							
								//if (isset($temp_block) && in_array($this -> W[$td]['q']['id'], $_SESSION['in_block'])) // back data hit

								array_push($answer_body,
							
									'<div class="answer-item">',
									
									'<label class="file">',
									
									'<span>Выбрать файл</span>',
									
									'<input id="' . $this -> W[$td]['q']['id'] . '_' . $this -> W[$td]['a'][0]['a_id'] . '" type="file" name="files' . $this -> W[$td]['q']['id'] . '[]"' . ($this -> W[$td]['a'][0]['input_set'] ? $this -> W[$td]['a'][0]['input_set'] : '') . '>',
									
									'</label>',
									
									'<div style="height:40px"></div>'
									
								);
								
								if (isset($temp_block) && in_array($this -> W[$td]['q']['id'], $_SESSION['in_block'])) foreach ($temp_block[$this -> W[$td]['q']['id']] as $fn_key => $fn_data) array_push($answer_body, '<div class="file-item-container"><span class="file-num">' . $fn_key . '</span><span class="file-name">' . substr($fn_data, strpos($fn_data, '/') + 1) . '</span></div>');
					
								array_push($answer_body, '</div>');
							
							break; // file
							
						}
						
						array_push($answer_body, '</div>');
						
						if (count($tr) > 1) {
							
							$astruct .= '<td style="vertical-align:top">' . implode($answer_body) . '</td>';
							
						} else $astruct .= implode($answer_body);
						
						$j ++;
			
					}
					
					$astruct .= ((count($tr) > 1) ? '</tr></table>' : '') . '</td></tr>';
					
				}
				
				$astruct .= '
				
				</table>
				
			</td>
			
		</tr>
		
		<tr>
		
			<td>
			
				<table class="navi">
						
					<tr>' . ($_SESSION['w_amount'] > 1 ? '<td><span id="prev" class="prev" data-control-type="button">Назад</span></td>' : '') . '
								
						<td><span id="clear" data-control-type="button">Очистить</span></td>
								
						<td><span id="next" class="next" data-control-type="button">Следующий</span></td>
								
						<td></td>
							
					</tr>
						
				</table> 
						
			</td>
					
		</tr>
		
	</table>';
				
				$post_data_insert = isset($temp_block) ? 'var POSTDATA = ' . $temp_data['block_' . $_SESSION['w_amount']] . ';' : 'var POSTDATA = {' . implode(': {}, ', $_SESSION['in_block']) . ': {}};';
				
				return array('structure' => $astruct, 'pdi' => $post_data_insert);
		
			break; // a
			
			case 'f':
			
				return array('structure' => '
				
	<table class="final-container">
	
		<tr>
		
			<td>Анкета заполнена и готова к отправке.<br>После отправки редактирование станет невозможным.<br>Отправляя анкету, вы подтверждаете правильность её заполнения.</td>
		
		</tr>
		
		<tr>
		
			<td>
			
				<table class="navi">
							
					<tr>
								
						<td><span id="prev" class="prev" data-control-type="button">Назад</span></td>
								
						<td><span id="next" class="next" data-control-type="button">Отправить</span></td>
								
						<td></td>
							
					</tr>
						
				</table> 
			
			</td>
		
		</tr>
	
	</table>

				', 'pdi' => '');
			
			break; // f
		
		}
		
	}
	
}

$AW = new AWORKWER();

if (isset($_REQUEST[session_name()])) session_start();

if (isset($_SESSION['ip']) && $_SESSION['ip'] == $_SERVER['REMOTE_ADDR']) {
	
	define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR_f00kmFE1_CC');
	
	require_once CDIR . '/equipment/functions.php';
		
	$DB = new DBWORKER('localhost', 'jrc workflow', 'utf8', 'jrc_member', 'J8LTaqqHDrpd6TWd');
	
	if (isset($_POST['w_amount'])) {
		
		if (isset($_POST['post_data']) && $_POST['w_amount'] == $_SESSION['w_amount']) {
			
			$b_data = $AW -> post();
		
			if ($b_data) {
			 
				if (! $_SESSION['work_process']) {
							
					$_SESSION['work_process'] = 1;
				
					$DB -> prep('INSERT INTO `' . $_SESSION['project'] . '_temp_out` (`uid`, `block_1`) VALUES (' . $_SESSION['id'] . ', :block)', array('block' => json_encode($b_data)));
					
				} else $DB -> prep('UPDATE `' . $_SESSION['project'] . '_temp_out` SET `block_' . $_POST['w_amount'] . '` = :block WHERE `uid` = ' . $_SESSION['id'] . ' LIMIT 1', array('block' => json_encode($b_data)));
				
				if ($_SESSION['q_transition']) { // transition $_SESSION['w_amount']
							
								
								
				} else {
					
					$_SESSION['w_amount'] ++;
					
					//if ($_SESSION['w_amount'] > $_SESSION['b_amount']) $final = true;

				}
			 
		 	}
			
		}
		
		if (isset($_POST['logout'])) $AW -> logout();
		
		if (! isset($_POST['post_data']) && $_POST['w_amount'] > 0 && ($_SESSION['w_amount'] - $_POST['w_amount'] == 1)) $_SESSION['w_amount'] --;
		
		if (! isset($_POST['post_data']) && $_POST['w_amount'] == $_SESSION['w_amount'] && $_SESSION['w_amount'] > $_SESSION['b_amount']) {
			
			$finalize = $AW -> finalize();
			
			if ($finalize && $finalize <= $_SESSION['wave_entry']) {
				
				$_SESSION['w_amount'] = 1;
			
				$_SESSION['work_process'] = 0;
				
				$_SESSION['iw_count'] ++;
				
			} else {
				
				$DB -> prep('UPDATE `users` SET `userstatus` = 0 WHERE `id` = ' . $_SESSION['id'] . ' LIMIT 1');
			
				$AW -> logout();
				
			}
			
		}
		
		if ($_SESSION['w_amount'] > $_SESSION['b_amount']) {
			
			 $window_data = $AW -> build('f');
			
		} else $window_data = $AW -> build('a');
		
	} else $window_data = $AW -> build('a');
	
	echo '
	
<html>

    <head>

        <meta http-equiv="content-type" content="text/html; charset=utf-8" />

        <meta name="robots" content="ALL" />
        
        <meta name="description" content="Все сервисы исследовательской компании Just Research Center - лидера полевых маркетинговых исследований в московской области по параметрам качества данных, оперативности сбора и адекватности стоимости услуг" />
        
        <meta name="keywords" content="" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        
        <title>JRCenter Workflow</title>
        
        <link rel="stylesheet" href="../public/css/workflow.css" />
		
		<script src="../public/js/0.js"></script>
		
		<script src="../public/js/workflow.js"></script>
		
		<script>' . $window_data['pdi'] . '</script>
		
	</head>
    
    <body>
	
		<table class="heading">
        
        	<tr>
			
				<td></td>
            
            	<td style="width:50px;"><div class="logo-container"></div></td>
				
				<td style="width:15%;"><b>Just Research Center</b></td>
                
                <td style="width:15%;">Анкета №' . $_SESSION['iw_count'] . ' (' . $_SESSION['wave_entry'] . ')</td>
                
                <td style="width:15%;"><div id="logout" data-control-type="button">Выход</div></td>
				
				<td></td>
            
            </tr>
        
        </table>' . 
		
		$window_data['structure'] . '
		
		<form method="post" enctype="multipart/form-data"> <!--action="http://192.168.11.11/ank/public/php/test.php" target="_blank">-->
                                
            <input type="hidden" name="w_amount" value="' . $_SESSION['w_amount'] . '">

        </form>
		
	</body>
	
</html>
		
		';

} else {
	
	if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_SERVER['HTTP_REFERER'] && isset($_POST['login_hash']) && strlen($_POST['login_hash']) == 32) {
		
		define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR_f00kmFE1_CC');

		require_once CDIR . '/equipment/functions.php';
	
		$DB = new DBWORKER('localhost', 'jrc workflow', 'utf8', 'jrc_member', 'J8LTaqqHDrpd6TWd');
		
		$userdata = $DB -> prep('SELECT `id`, `userstatus`, `project` FROM `users` WHERE `hash` = :hash LIMIT 1', array('hash' => sha1($_POST['login_hash'] . SECRET))) -> fetch(PDO :: FETCH_ASSOC);
		
		if ($userdata && $userdata['userstatus'] > 0) {
		
			if (isset($_POST['login_local'])) {
				
				$workprojectdata = $DB -> prep('SELECT `b_amount`, `q_amount`, `q_transition`, `wave_current`, `wave_entry`, `file_upload` FROM `projects` WHERE `id` = ' . $userdata['project'] . ' AND `status` = 1') -> fetch(PDO :: FETCH_ASSOC);
				
				if (count($workprojectdata)) {
			
					preg_match('/(msie|opera|firefox|chrome|version)(?:\/|\s)(\d+)/i', $_SERVER['HTTP_USER_AGENT'], $browser);
				
					ini_set('session.cookie_lifetime', 3600); //2592000 1 month
							  
					if (! isset($_SESSION)) session_start();
					
					$_SESSION = array_merge($_SESSION, $userdata, $workprojectdata, array('ip' => $_SERVER['REMOTE_ADDR'], 'br_name' => $browser[1], 'br_ver' => $browser[2], 'w_amount' => 1, 'iw_count' => 1, 'work_process' => 0));
					
					header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
			
					exit;
					
				}
				
			} else echo 1;
		
		} else echo 0;
		
	} else {
		
		header('Location: http://' . $_SERVER['HTTP_HOST'] . '/ank/');

		exit;	
		
	}
	
}

?>