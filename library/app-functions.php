<?php
	/*
	*	contains project related php functions
	*
	*/
	

	if (!function_exists('get_img_uri')) :
		function get_img_uri($img) {
		  return get_template_directory_uri()."/".IMG_DIR."/".$img;
		}
	endif;

	if (!function_exists('img_uri')) :
	function img_uri($img) {
	  echo get_img_uri($img);
	}
	endif;

	if(!function_exists('sanitize_mail')) :
		function sanitize_mail($mail) {
			return filter_var($mail, FILTER_SANITIZE_EMAIL);
		}
	endif;

	if(!function_exists('is_valid_mail')) :
		function is_valid_mail($mail) {
			$sanitized_mail = sanitize_mail($mail);
			return filter_var($sanitized_mail, FILTER_VALIDATE_EMAIL);
		}
	endif;


	if(!function_exists('send_mail')) :
		function send_mail($from,$to,$subject,$message) {
			if(is_valid_mail($from)) {
				if(is_valid_mail($to)) {
				   
    				$mail = new PHPMailer;

                    //$mail->SMTPDebug = 3;                               // Enable verbose debug output
                    
                    $mail->isSMTP();
                    $mail->CharSet = 'UTF-8';
                    $mail->Host = SMTP_SRVR;
                    $mail->SMTPAuth = true;                               
                    $mail->Username = SMTP_USR; 
                    $mail->Password = SMTP_PWD;                        
                    $mail->SMTPSecure = SMTP_SCRTY;
                    $mail->Port = SMTP_PRT;                                    
                   
                    $mail->From = SMTP_USR;
                    $mail->FromName = $from;
                    $mail->addAddress($to);
                    $mail->addReplyTo($from);
                    
                    $mail->WordWrap = 50;                                
                    $mail->isHTML(false);
                    
                    $mail->Subject = $subject;
                    $mail->Body    = $message;
                    
                    if(!$mail->send()) {
                        return 'Mailer Error: ' . $mail->ErrorInfo;
                    } else {
                        return "MAIL_SUCCESS";
                    }
    			
				}else {
					return "MAIL_INVALID_TO";
				}
			}else{
				return "MAIL_INVALID_FROM";
			}
		}
	endif;

	if(!function_exists('ajax_send_mail_action')) :
		function ajax_send_mail_action() {
			if (isset($_POST["from"])) {
				$from = $_POST["from"];
				$to = $_POST["to"];
	    		$subject = $_POST["subject"];
	    		$message = $_POST["message"];
	    		echo send_mail($from,$to,$subject,$message);
	    	}else{
	    		echo "MAIL_NO_DATA";
	    	}

	    	die();
		}
	endif;

	add_action('wp_ajax_sendmail', 'ajax_send_mail_action');
	add_action('wp_ajax_nopriv_sendmail', 'ajax_send_mail_action');

?>